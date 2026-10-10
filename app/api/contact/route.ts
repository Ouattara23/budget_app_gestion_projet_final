export const runtime = "nodejs"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
    let body: { email?: unknown; message?: unknown }
    try {
        body = await request.json()
    } catch {
        return Response.json({ error: "Le formulaire est illisible." }, { status: 400 })
    }

    const email = typeof body.email === "string" ? body.email.trim() : ""
    const message = typeof body.message === "string" ? body.message.trim() : ""
    if (!EMAIL_PATTERN.test(email) || email.length > 254) return Response.json({ error: "Saisissez une adresse email valide." }, { status: 400 })
    if (message.length < 5 || message.length > 5000) return Response.json({ error: "Le message doit contenir entre 5 et 5 000 caractères." }, { status: 400 })

    const { RESEND_API_KEY, CONTACT_EMAIL_TO, CONTACT_EMAIL_FROM } = process.env
    if (!RESEND_API_KEY || !CONTACT_EMAIL_TO || !CONTACT_EMAIL_FROM) {
        return Response.json({ error: "L’envoi par email n’est pas encore configuré. Vous pouvez nous écrire dès que le service de messagerie sera activé." }, { status: 503 })
    }

    try {
        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                from: CONTACT_EMAIL_FROM,
                to: [CONTACT_EMAIL_TO],
                reply_to: email,
                subject: "Nouveau message depuis BudgetApp",
                text: `Adresse du client : ${email}\n\nMessage :\n${message}`,
            }),
            signal: AbortSignal.timeout(15_000),
        })
        if (!response.ok) {
            console.error("[Contact] Le fournisseur email a refusé le message.", response.status)
            return Response.json({ error: "Le message n’a pas pu être envoyé. Réessayez un peu plus tard." }, { status: 502 })
        }
        return Response.json({ ok: true })
    } catch (error) {
        console.error("[Contact] Erreur lors de l’envoi du message.", error)
        return Response.json({ error: "Le service email ne répond pas pour le moment. Réessayez un peu plus tard." }, { status: 502 })
    }
}
