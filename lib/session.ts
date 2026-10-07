import { InitAuth } from "@/fireBaseConfig"
import { SessionUser } from "@/types"

// Utilisateur actuellement connecté.
// Firebase est la source de vérité (disponible dès que le garde d'accès a laissé passer la page) ;
// localStorage ne sert que de secours.
export const getSessionUser = (): SessionUser | null => {
    if (typeof window === "undefined") return null

    const actuel = InitAuth.currentUser
    if (actuel) return { id: actuel.uid, nom: actuel.displayName }

    try {
        const brut = localStorage.getItem("user")
        return brut ? (JSON.parse(brut) as SessionUser) : null
    } catch {
        return null
    }
}
