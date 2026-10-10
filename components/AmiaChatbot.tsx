"use client"

import { useEffect, useRef, useState } from "react"
import type { FormEvent } from "react"
import { LuBot, LuChevronDown, LuMail, LuMic, LuMicOff, LuMessageCircle, LuPlus, LuSend, LuX } from "react-icons/lu"

type Message = { role: "user" | "assistant"; content: string }
type Tab = "chat" | "email"
type SpeechResultEvent = Event & { results: SpeechRecognitionResultList }
type SpeechRecognitionLike = {
    lang: string
    interimResults: boolean
    onresult: ((event: SpeechResultEvent) => void) | null
    onerror: (() => void) | null
    onend: (() => void) | null
    start: () => void
    stop: () => void
}

const initialMessage: Message = {
    role: "assistant",
    content: "Bonjour, je suis Amia, l’assistant de BudgetApp. Comment puis-je vous aider avec votre budget ?",
}

function getSpeechRecognition(): (new () => SpeechRecognitionLike) | undefined {
    if (typeof window === "undefined") return undefined
    const speechWindow = window as Window & { SpeechRecognition?: new () => SpeechRecognitionLike; webkitSpeechRecognition?: new () => SpeechRecognitionLike }
    return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition
}

export default function AmiaChatbot() {
    const [open, setOpen] = useState(false)
    const [tab, setTab] = useState<Tab>("chat")
    const [messages, setMessages] = useState<Message[]>([initialMessage])
    const [draft, setDraft] = useState("")
    const [busy, setBusy] = useState(false)
    const [recording, setRecording] = useState(false)
    const [error, setError] = useState("")
    const [email, setEmail] = useState("")
    const [emailMessage, setEmailMessage] = useState("")
    const [emailStatus, setEmailStatus] = useState("")
    const [emailBusy, setEmailBusy] = useState(false)
    const listRef = useRef<HTMLDivElement>(null)
    const recognitionRef = useRef<SpeechRecognitionLike | null>(null)

    useEffect(() => {
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" })
    }, [messages, busy, open, tab])

    useEffect(() => () => recognitionRef.current?.stop(), [])

    async function sendMessage(event?: FormEvent) {
        event?.preventDefault()
        const content = draft.trim()
        if (!content || busy) return

        const nextMessages: Message[] = [...messages, { role: "user", content }]
        setMessages(nextMessages)
        setDraft("")
        setError("")
        setBusy(true)

        try {
            const response = await fetch("/api/amia", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: nextMessages.slice(-13) }),
            })
            const data = await response.json() as { reply?: string; error?: string }
            const reply = data.reply
            if (!response.ok || typeof reply !== "string" || !reply.trim()) throw new Error(data.error || "Amia ne peut pas répondre pour le moment.")
            setMessages((current) => [...current, { role: "assistant", content: reply }])
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : "Une erreur est survenue. Réessayez dans un instant.")
        } finally {
            setBusy(false)
        }
    }

    function startVoiceInput() {
        const Recognition = getSpeechRecognition()
        if (!Recognition) {
            setError("La dictée vocale n’est pas disponible dans ce navigateur. Vous pouvez saisir votre message au clavier.")
            return
        }
        setError("")
        const recognition = new Recognition()
        recognition.lang = "fr-FR"
        recognition.interimResults = true
        recognition.onresult = (event) => {
            const transcript = Array.from(event.results).map((result) => result[0]?.transcript ?? "").join("")
            setDraft(transcript)
        }
        recognition.onerror = () => {
            setRecording(false)
            setError("La dictée vocale a échoué. Vérifiez l’autorisation du microphone puis réessayez.")
        }
        recognition.onend = () => setRecording(false)
        recognitionRef.current = recognition
        setRecording(true)
        recognition.start()
    }

    async function submitEmail(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setEmailBusy(true)
        setEmailStatus("")
        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, message: emailMessage }),
            })
            const data = await response.json() as { error?: string }
            if (!response.ok) throw new Error(data.error || "Votre message n’a pas pu être envoyé.")
            setEmailStatus("Votre message a bien été envoyé. Merci de nous avoir écrit !")
            setEmail("")
            setEmailMessage("")
        } catch (reason) {
            setEmailStatus(reason instanceof Error ? reason.message : "Votre message n’a pas pu être envoyé.")
        } finally {
            setEmailBusy(false)
        }
    }

    function resetChat() {
        recognitionRef.current?.stop()
        setRecording(false)
        setMessages([initialMessage])
        setDraft("")
        setError("")
        setBusy(false)
    }

    return (
        <div className="amia-widget">
            {open && <section className="amia-panel" aria-label="Contacter BudgetApp">
                <header className="amia-header">
                    <div className="flex min-w-0 items-center gap-3">
                        <span className="amia-avatar"><LuBot className="size-5" /></span>
                        <div className="min-w-0"><h2 className="truncate text-sm font-bold">Amia · BudgetApp</h2><p className="mt-0.5 text-xs text-blue-100">À votre écoute</p></div>
                    </div>
                    <button type="button" className="amia-icon-button" aria-label="Réduire le chatbot" onClick={() => setOpen(false)}><LuChevronDown className="size-5" /></button>
                </header>

                <div className="amia-tabs" role="tablist" aria-label="Choisir un mode de contact">
                    <button type="button" role="tab" aria-selected={tab === "chat"} className={`amia-tab ${tab === "chat" ? "is-active" : ""}`} onClick={() => setTab("chat")}><LuMessageCircle className="size-4" /> Discuter avec Amia</button>
                    <button type="button" role="tab" aria-selected={tab === "email"} className={`amia-tab ${tab === "email" ? "is-active" : ""}`} onClick={() => setTab("email")}><LuMail className="size-4" /> Nous écrire par mail</button>
                </div>

                {tab === "chat" ? <>
                    <div ref={listRef} className="amia-messages" role="log" aria-live="polite" aria-label="Conversation avec Amia">
                        {messages.map((message, index) => <div key={`${index}-${message.role}`} className={`amia-message-row ${message.role === "user" ? "is-user" : "is-assistant"}`}><div className="amia-message">{message.content}</div></div>)}
                        {busy && <div className="amia-message-row is-assistant"><div className="amia-message amia-typing"><span /><span /><span /><span className="sr-only">Amia rédige une réponse</span></div></div>}
                    </div>
                    <div className="amia-chat-tools"><span>Vos réponses s’appuient sur la présentation commerciale BudgetApp.</span><button type="button" onClick={resetChat} disabled={busy} className="amia-reset" title="Commencer une nouvelle discussion"><LuPlus className="size-3.5" /> Nouveau chat</button></div>
                    {error && <p className="amia-error" role="alert">{error}</p>}
                    <form className="amia-composer" onSubmit={sendMessage}>
                        <label className="sr-only" htmlFor="amia-chat-input">Votre message</label>
                        <textarea id="amia-chat-input" rows={1} maxLength={2000} value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void sendMessage() } }} placeholder="Écrivez votre message…" />
                        <button type="button" className={`amia-mic ${recording ? "is-recording" : ""}`} onClick={() => recording ? recognitionRef.current?.stop() : startVoiceInput()} aria-label={recording ? "Arrêter la dictée vocale" : "Dicter un message vocal"} title={recording ? "Arrêter la dictée" : "Dicter un message"}>{recording ? <LuMicOff className="size-5" /> : <LuMic className="size-5" />}</button>
                        <button type="submit" className="amia-send" disabled={!draft.trim() || busy} aria-label="Envoyer le message"><LuSend className="size-4" /></button>
                    </form>
                    <p className="amia-footnote">Entrée pour envoyer · Maj + Entrée pour aller à la ligne</p>
                </> : <form className="amia-email-form" onSubmit={submitEmail}>
                    <div><h3 className="text-lg font-bold text-slate-900">Écrivez-nous</h3><p className="mt-1 text-sm leading-6 text-slate-500">Laissez votre adresse email et votre message. Notre équipe pourra vous répondre.</p></div>
                    <label htmlFor="amia-email" className="amia-label">Votre adresse email</label>
                    <input id="amia-email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} placeholder="vous@exemple.com" className="amia-input" />
                    <label htmlFor="amia-email-message" className="amia-label">Votre message</label>
                    <textarea id="amia-email-message" required minLength={5} maxLength={5000} rows={6} value={emailMessage} onChange={(event) => setEmailMessage(event.target.value)} placeholder="Comment pouvons-nous vous aider ?" className="amia-input amia-email-textarea" />
                    {emailStatus && <p className={`amia-email-status ${emailStatus.startsWith("Votre message a bien") ? "is-success" : "is-error"}`} role="status">{emailStatus}</p>}
                    <button type="submit" disabled={emailBusy} className="amia-email-submit">{emailBusy ? "Envoi en cours…" : <>Envoyer le message <LuSend className="size-4" /></>}</button>
                    <p className="amia-footnote">Votre adresse sera utilisée uniquement pour répondre à votre demande.</p>
                </form>}
            </section>}
            <button type="button" className={`amia-launcher ${open ? "is-open" : ""}`} onClick={() => setOpen((value) => !value)} aria-label={open ? "Fermer Amia" : "Ouvrir le chatbot Amia"} aria-expanded={open}>
                {open ? <LuX className="size-6" /> : <><LuMessageCircle className="size-6" /><span>Parler à Amia</span></>}
            </button>
        </div>
    )
}
