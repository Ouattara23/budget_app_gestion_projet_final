import { readFile } from "node:fs/promises"
import path from "node:path"

export const runtime = "nodejs"

type ChatMessage = { role: "user" | "assistant"; content: string }
type ProviderResult = { reply: string; provider: string }
type GeminiResponse = { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> }
type CompatibleResponse = { choices?: Array<{ message?: { content?: unknown } }> }
type ProviderError = { message?: string; error?: string | { message?: string } }

const TIMEOUT_MS = 25_000
const MAX_MESSAGES = 13
const MAX_MESSAGE_CHARS = 2_000

async function fetchWithTimeout(url: string, init: RequestInit) {
    return fetch(url, { ...init, signal: AbortSignal.timeout(TIMEOUT_MS), cache: "no-store" })
}

async function responseJson<T>(response: Response): Promise<T> {
    const raw = await response.text()
    let payload: unknown
    try {
        payload = JSON.parse(raw)
    } catch {
        payload = undefined
    }
    if (!response.ok) {
        const error = payload as ProviderError | undefined
        const detail = typeof error?.error === "string" ? error.error : error?.error?.message || error?.message
        const safeDetail = detail?.replace(/[\r\n\t]+/g, " ").slice(0, 180)
        throw new Error(`Provider HTTP ${response.status}${safeDetail ? `: ${safeDetail}` : ""}`)
    }
    if (!payload) throw new Error("Provider returned invalid JSON")
    return payload as T
}

function nonEmptyReply(text: unknown): string {
    if (typeof text !== "string" || !text.trim()) throw new Error("Provider returned an empty answer")
    return text.trim()
}

function findDocumentedFaqAnswer(prompt: string, question: string): string | undefined {
    const stopWords = new Set(["avec", "comment", "dans", "des", "est", "et", "je", "la", "le", "les", "ma", "mes", "mon", "ou", "par", "pour", "puis", "que", "quel", "quelle", "quels", "quelles", "sur", "un", "une", "vous", "budgetapp"])
    const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().match(/[a-z0-9]+/g) || []
    const terms = (value: string) => [...new Set(normalize(value).filter((term) => term.length > 2 && !stopWords.has(term)))]
    const queryTerms = terms(question)
    if (queryTerms.length === 0) return undefined

    const entries = [...prompt.matchAll(/^Q\s*:\s*(.+)\r?\nR\s*:\s*(.+)$/gm)].map((match) => ({ question: match[1], answer: match[2], terms: terms(match[1]) }))
    const matches = entries.map((entry) => ({ ...entry, shared: queryTerms.filter((term) => entry.terms.includes(term)) })).filter((entry) => entry.shared.length > 0)
    if (queryTerms.length === 1 && matches.length !== 1) return undefined
    const best = matches.sort((a, b) => b.shared.length / b.terms.length - a.shared.length / a.terms.length)[0]
    if (!best || best.shared.length / queryTerms.length < 0.6) return undefined
    return `${best.answer}${best.answer.toLowerCase().includes("présentation commerciale") ? "" : " D’après la présentation commerciale de BudgetApp."}`
}

async function askGemini(apiKey: string, system: string, messages: ChatMessage[]): Promise<ProviderResult> {
    const contents = messages.map((message) => ({ role: message.role === "assistant" ? "model" : "user", parts: [{ text: message.content }] }))
    const response = await fetchWithTimeout(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(process.env.GEMINI_MODEL || "gemini-3.8-flash")}:generateContent`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify({ system_instruction: { parts: [{ text: system }] }, contents, generationConfig: { temperature: 0.25, maxOutputTokens: 600 } }),
    })
    const data = await responseJson<GeminiResponse>(response)
    const parts = data.candidates?.[0]?.content?.parts as Array<{ text?: string }> | undefined
    return { reply: nonEmptyReply(parts?.map((part) => part.text || "").join("")), provider: "Gemini" }
}

async function askOpenAICompatible(provider: "Mistral" | "OpenRouter", apiKey: string, model: string, system: string, messages: ChatMessage[]): Promise<ProviderResult> {
    const url = provider === "Mistral" ? "https://api.mistral.ai/v1/chat/completions" : "https://openrouter.ai/api/v1/chat/completions"
    const headers: Record<string, string> = { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` }
    if (provider === "OpenRouter") headers["HTTP-Referer"] = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const response = await fetchWithTimeout(url, {
        method: "POST",
        headers,
        body: JSON.stringify({ model, messages: [{ role: "system", content: system }, ...messages], temperature: 0.25, max_tokens: 600 }),
    })
    const data = await responseJson<CompatibleResponse>(response)
    return { reply: nonEmptyReply(data.choices?.[0]?.message?.content), provider }
}

export async function POST(request: Request) {
    let payload: { messages?: unknown }
    try {
        payload = await request.json()
    } catch {
        return Response.json({ error: "La demande est illisible." }, { status: 400 })
    }

    if (!Array.isArray(payload.messages) || payload.messages.length < 1 || payload.messages.length > MAX_MESSAGES) {
        return Response.json({ error: "La conversation ne contient pas de messages valides." }, { status: 400 })
    }
    const messages = payload.messages as ChatMessage[]
    if (messages.some((message) => !message || !["user", "assistant"].includes(message.role) || typeof message.content !== "string" || !message.content.trim() || message.content.length > MAX_MESSAGE_CHARS)) {
        return Response.json({ error: "Un message est vide ou dépasse la taille autorisée." }, { status: 400 })
    }
    if (messages.at(-1)?.role !== "user") return Response.json({ error: "Envoyez un message pour continuer." }, { status: 400 })

    try {
        const docsDirectory = path.join(process.cwd(), "docs")
        const [prompt, presentation] = await Promise.all([
            readFile(path.join(docsDirectory, "Amia_Prompt_Systeme.md"), "utf8"),
            readFile(path.join(docsDirectory, "BudgetApp_Presentation_Commerciale.md"), "utf8"),
        ])
        const system = `${prompt}\n\n--- DOCUMENT COMMERCIAL DE RÉFÉRENCE ---\n${presentation}`
        const providers: Array<{ name: string; run: () => Promise<ProviderResult> }> = []
        if (process.env.GEMINI_API_KEY) providers.push({ name: "Gemini", run: () => askGemini(process.env.GEMINI_API_KEY!, system, messages) })
        if (process.env.MISTRAL_API_KEY) providers.push({ name: "Mistral", run: () => askOpenAICompatible("Mistral", process.env.MISTRAL_API_KEY!, process.env.MISTRAL_MODEL || "mistral-small-latest", system, messages) })
        if (process.env.OPENROUTER_API_KEY) providers.push({ name: "OpenRouter", run: () => askOpenAICompatible("OpenRouter", process.env.OPENROUTER_API_KEY!, process.env.OPENROUTER_MODEL || "mistralai/mistral-small-3.2-24b-instruct", system, messages) })
        if (providers.length === 0) return Response.json({ error: "Le service de discussion sera disponible dès que ses clés de connexion auront été configurées." }, { status: 503 })

        const failures: string[] = []
        for (const provider of providers) {
            try {
                const result = await provider.run()
                return Response.json(result)
            } catch (error) {
                failures.push(`${provider.name}: ${error instanceof Error ? error.message : "erreur inconnue"}`)
                console.warn(`[Amia] ${provider.name} indisponible, essai du fournisseur suivant.`)
            }
        }
        console.error(`[Amia] Tous les fournisseurs configurés ont échoué: ${failures.join(" | ")}`)
        const faqReply = findDocumentedFaqAnswer(prompt, messages.at(-1)!.content)
        if (faqReply) return Response.json({ reply: faqReply, provider: "FAQ documentaire" })
        return Response.json({ error: "Amia est temporairement indisponible. Réessayez dans quelques instants." }, { status: 502 })
    } catch (error) {
        console.error("[Amia] Impossible de charger les documents de référence.", error)
        return Response.json({ error: "Les documents de référence d’Amia sont temporairement indisponibles." }, { status: 500 })
    }
}
