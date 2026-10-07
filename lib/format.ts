export const formatFCFA = (n: number | string) =>
    `${Number(n || 0).toLocaleString("fr-FR")} FCFA`

// "2026-10-03T14:30" -> "03/10/2026 à 14:30" (format français jj/mm/aaaa)
export const formatDateHeure = (iso: string) => {
    const d = new Date(iso)
    if (isNaN(d.getTime())) return "—"
    return `${d.toLocaleDateString("fr-FR")} à ${d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`
}

// "2026-10" -> "octobre 2026"
export const formatMois = (mois: string) => {
    if (!mois) return "—"
    const d = new Date(`${mois}-01`)
    return isNaN(d.getTime()) ? mois : d.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })
}

// Mois en cours au format AAAA-MM
export const moisCourant = () => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
}

// Valeur par défaut d'un champ datetime-local (heure locale, pas UTC)
export const dateHeureLocale = () => {
    const d = new Date()
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
    return d.toISOString().slice(0, 16)
}
