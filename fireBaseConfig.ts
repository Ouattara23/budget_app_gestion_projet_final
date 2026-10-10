import { getApp, getApps, initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import { getAuth } from "firebase/auth"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_apiKey,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.NEXT_PUBLIC_authDomain,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_projectId,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_storageBucket,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.NEXT_PUBLIC_messagingSenderId,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || process.env.NEXT_PUBLIC_appId,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || process.env.NEXT_PUBLIC_measurementId,
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

function verifierConfigurationFirebase(usage: "auth" | "storage") {
    const champsRequis = usage === "auth"
        ? ["apiKey", "authDomain", "projectId", "appId"] as const
        : ["apiKey", "projectId", "appId", "storageBucket"] as const
    const manquants = champsRequis.filter((champ) => !firebaseConfig[champ])

    if (manquants.length > 0) {
        throw new Error(
            "Firebase configuration is incomplete for " + usage +
            ". Set the NEXT_PUBLIC_FIREBASE_* variables in the Vercel deployment environment. Missing fields: " +
            manquants.join(", ") + ".",
        )
    }
}

// Auth et Storage sont créés à la demande : le rendu serveur ne les initialise
// pas avec des variables d'environnement absentes pendant le build.
export const getFirebaseAuth = () => {
    verifierConfigurationFirebase("auth")
    return getAuth(app)
}

export const getFirebaseStorage = () => {
    verifierConfigurationFirebase("storage")
    return getStorage(app)
}

let analytics: ReturnType<typeof getAnalytics> | null = null

if (typeof window !== "undefined" && firebaseConfig.measurementId) {
    analytics = getAnalytics(app)
}

export { analytics }
