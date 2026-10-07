"use client"

import { InitAuth } from "@/fireBaseConfig"
import { messageErreurFirebase } from "@/lib/erreursAuth"
import axios from "axios"
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import { LuEye, LuEyeOff, LuLock, LuMail, LuPhone, LuUser } from "react-icons/lu"
import AuthLayout, { Champ } from "./AuthLayout"
import GoogleAuthBtn from "./GoogleAuthBtn"

const classeInput = "flex-1 min-w-0 bg-transparent outline-none"

function Inscription() {
    const router = useRouter()
    const [nom, setNom] = useState("")
    const [telephone, setTelephone] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [cpassword, setCpassword] = useState("")
    const [afficher, setAfficher] = useState(false)
    const [load, setLoad] = useState(false)
    const [erreur, setErreur] = useState("")

    const submitForm = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        setErreur("")

        // Validation côté client
        if (!nom.trim()) return setErreur("Le nom complet est requis.")
        if (password.length < 6) return setErreur("Le mot de passe doit contenir au moins 6 caractères.")
        if (password !== cpassword) return setErreur("Les deux mots de passe ne sont pas identiques.")

        setLoad(true)
        try {
            const { user } = await createUserWithEmailAndPassword(InitAuth, email.trim(), password)
            await updateProfile(user, { displayName: nom.trim() })
            sendEmailVerification(user).catch(() => {})

            // Sauvegarde du profil côté serveur, sans jamais envoyer le mot de passe.
            // Échec non bloquant : le compte Firebase existe déjà.
            axios
                .post("/server/users/new-user", { id: user.uid, nom: nom.trim(), telephone, email: email.trim() })
                .catch(() => console.warn("Profil non synchronisé avec le serveur"))

            router.push("/tableau-de-bord")
        } catch (error) {
            setErreur(messageErreurFirebase(error))
            setLoad(false)
        }
    }

    return (
        <AuthLayout titre="Inscription" sousTitre="Bienvenue ! Créez votre compte.">
            <form onSubmit={submitForm} className="space-y-4">
                <Champ label="Nom complet" icone={<LuUser />}>
                    <input type="text" required autoComplete="name" value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Votre nom complet" className={classeInput} />
                </Champ>

                <Champ label="Téléphone (facultatif)" icone={<LuPhone />}>
                    <input type="tel" autoComplete="tel" value={telephone} onChange={(e) => setTelephone(e.target.value)} placeholder="Votre numéro" className={classeInput} />
                </Champ>

                <Champ label="Email" icone={<LuMail />}>
                    <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Votre email" className={classeInput} />
                </Champ>

                <Champ label="Mot de passe" icone={<LuLock />}>
                    <input type={afficher ? "text" : "password"} required autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="6 caractères minimum" className={classeInput} />
                    <button type="button" onClick={() => setAfficher(!afficher)} aria-label={afficher ? "Masquer les mots de passe" : "Afficher les mots de passe"} className="text-slate-500 hover:text-slate-700">
                        {afficher ? <LuEye /> : <LuEyeOff />}
                    </button>
                </Champ>

                <Champ label="Confirmer le mot de passe" icone={<LuLock />}>
                    <input type={afficher ? "text" : "password"} required autoComplete="new-password" value={cpassword} onChange={(e) => setCpassword(e.target.value)} placeholder="Confirmez votre mot de passe" className={classeInput} />
                </Champ>

                {erreur && <div role="alert" className="alert alert-error alert-soft text-sm">{erreur}</div>}

                <button type="submit" disabled={load} className="w-full h-14 bg-sky-600 hover:bg-sky-700 disabled:opacity-70 rounded-xl text-white font-semibold duration-300 flex items-center justify-center gap-2">
                    {load && <span className="loading loading-spinner loading-sm"></span>}
                    Créer mon compte
                </button>

                <div className="flex items-center justify-center gap-3 text-slate-500">
                    <span className="w-16 h-px bg-slate-300"></span>
                    Ou
                    <span className="w-16 h-px bg-slate-300"></span>
                </div>

                <div className="flex items-center justify-center">
                    <GoogleAuthBtn />
                </div>

                <p className="flex justify-center items-center gap-2 text-slate-600">
                    Vous avez déjà un compte ?
                    <Link href="/connexion" className="text-sky-600 underline">Se connecter</Link>
                </p>
            </form>
        </AuthLayout>
    )
}

export default Inscription
