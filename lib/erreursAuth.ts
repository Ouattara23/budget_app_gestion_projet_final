// Traduit les codes d'erreur Firebase en messages compréhensibles
export const messageErreurFirebase = (error: unknown): string => {
    const code = (error as { code?: string })?.code ?? ""

    switch (code) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
            return "Email ou mot de passe incorrect."
        case "auth/invalid-email":
            return "Adresse email invalide."
        case "auth/email-already-in-use":
            return "Cette adresse email est déjà utilisée."
        case "auth/weak-password":
            return "Mot de passe trop faible (6 caractères minimum)."
        case "auth/too-many-requests":
            return "Trop de tentatives. Réessayez dans quelques minutes."
        case "auth/network-request-failed":
            return "Problème de connexion internet. Vérifiez votre réseau."
        case "auth/popup-closed-by-user":
            return "Connexion annulée."
        default:
            return "Une erreur s'est produite. Veuillez réessayer."
    }
}
