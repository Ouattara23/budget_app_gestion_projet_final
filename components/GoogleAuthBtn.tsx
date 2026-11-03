"use client"

import { getFirebaseAuth } from '@/fireBaseConfig'
import { messageErreurFirebase } from '@/lib/erreursAuth'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

function GoogleAuthBtn() {

    const route = useRouter() //pour rediriger sur d'autres page via js avec nextjs
    const [chargement, setChargement] = useState(false)
    const [erreur, setErreur] = useState("")

    const googleConnect = async () => {
        if (chargement) return
        setChargement(true)
        setErreur("")
        try {
            //on appel le provider(fournisseur ou methode de connexion)
            const provider = new GoogleAuthProvider()
            //laisse l'utilisateur choisir son compte Google à chaque fois
            provider.setCustomParameters({ prompt: "select_account" })

            //on se connecte maintenant via google
            const data = await signInWithPopup(getFirebaseAuth(), provider)

            if (!data?.user) {
                setChargement(false)
                setErreur("Impossible de se connecter à votre compte Google. Réessayez ou vérifiez votre connexion.")
                return;
            }
            //on recupere les infos de connexion
            const user = data?.user

            if (typeof window !== "undefined") localStorage.setItem("user", JSON.stringify({
                id: user.uid,
                nom: user.displayName
            }))

            //on le redirige sur le back office
            route.push("/tableau-de-bord")

        } catch (error: unknown) {
            // Le code Firebase (ex. auth/unauthorized-domain) et le domaine courant aident à diagnostiquer vite.
            const details = error as { code?: string; message?: string }
            console.error("[Google Auth]", details?.code, details?.message, "domaine:", typeof window !== "undefined" ? window.location.hostname : "")
            setChargement(false)
            setErreur(messageErreurFirebase(error))
        }
    }

    return (
        <div className="flex flex-col items-center">
            <button type="button" onClick={googleConnect} disabled={chargement} aria-busy={chargement} className="btn border-[#e5e5e5] bg-white text-black transition disabled:cursor-not-allowed disabled:opacity-70">
                {chargement ? <span className="loading loading-spinner loading-sm" aria-hidden="true" /> : <svg aria-label="Google logo" width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>}
                {chargement ? "Connexion à Google…" : "Continuer avec Google"}
            </button>
            {erreur && <p role="alert" className="mt-3 w-full text-center text-sm text-red-600">{erreur}</p>}
        </div>
    )
}

export default GoogleAuthBtn
