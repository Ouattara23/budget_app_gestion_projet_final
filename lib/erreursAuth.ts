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
        case "auth/cancelled-popup-request":
            return "Connexion annulée."
        case "auth/popup-blocked":
            return "Votre navigateur a bloqué la fenêtre Google. Autorisez les fenêtres pop-up pour ce site, puis réessayez."
        case "auth/unauthorized-domain":
        case "auth/operation-not-allowed":
        case "auth/invalid-api-key":
        case "auth/configuration-not-found":
            return "La connexion avec Google est momentanément indisponible. Connectez-vous avec votre email et votre mot de passe, ou réessayez plus tard."
        case "auth/web-storage-unsupported":
            return "Votre navigateur bloque le stockage nécessaire à la connexion Google. Ouvrez le site dans Chrome ou Safari (hors navigation privée) et réessayez."
        case "auth/account-exists-with-different-credential":
            return "Un compte existe déjà avec cet email. Connectez-vous avec votre email et votre mot de passe."
        default:
            return "Une erreur s'est produite. Veuillez réessayer."
    }
}
