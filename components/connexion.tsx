"use client"

import { InitAuth } from "@/fireBaseConfig"
import { messageErreurFirebase } from "@/lib/erreursAuth"
import {
    browserLocalPersistence,
    browserSessionPersistence,
    sendPasswordResetEmail,
    setPersistence,
    signInWithEmailAndPassword,
} from "firebase/auth"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import { LuEye, LuEyeOff, LuLock, LuMail } from "react-icons/lu"
import AuthLayout, { Champ } from "./AuthLayout"
import GoogleAuthBtn from "./GoogleAuthBtn"

function Connexion() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [afficher, setAfficher] = useState(false)
    const [souvenir, setSouvenir] = useState(true)
    const [load, setLoad] = useState(false)
    const [erreur, setErreur] = useState("")
    const [info, setInfo] = useState("")

    // Connexion 100 % Firebase (plus de double vérification avec un mot de passe en clair dans IndexedDB)
    const handleLogin = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        setErreur("")
        setInfo("")
        setLoad(true)

        try {
            await setPersistence(InitAuth, souvenir ? browserLocalPersistence : browserSessionPersistence)
            await signInWithEmailAndPassword(InitAuth, email.trim(), password)
            router.push("/tableau-de-bord")
        } catch (error) {
            setErreur(messageErreurFirebase(error))
            setLoad(false)
        }
    }

    const motDePasseOublie = async () => {
        setErreur("")
        setInfo("")
        if (!email.trim()) {
            setErreur("Saisissez d'abord votre email pour recevoir le lien de réinitialisation.")
            return
        }
        try {
            await sendPasswordResetEmail(InitAuth, email.trim())
            setInfo("Un email de réinitialisation vient de vous être envoyé.")
        } catch (error) {
            setErreur(messageErreurFirebase(error))
        }
    }

    return (
        <AuthLayout titre="Connexion" sousTitre="Bienvenue ! Connectez-vous à votre compte.">
            <form onSubmit={handleLogin} className="space-y-5">
                <Champ label="Email" icone={<LuMail />}>
                    <input
                        type="email"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Votre email"
                        className="flex-1 min-w-0 bg-transparent outline-none"
                    />
                </Champ>

                <Champ label="Mot de passe" icone={<LuLock />}>
                    <input
                        type={afficher ? "text" : "password"}
                        required
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Entrez votre mot de passe"
                        className="flex-1 min-w-0 bg-transparent outline-none"
                    />
                    <button
                        type="button"
                        onClick={() => setAfficher(!afficher)}
                        aria-label={afficher ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                        className="text-slate-500 hover:text-slate-700"
                    >
                        {afficher ? <LuEye /> : <LuEyeOff />}
                    </button>
                </Champ>

                <div className="flex justify-between items-center text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="checkbox checkbox-sm" checked={souvenir} onChange={(e) => setSouvenir(e.target.checked)} />
                        Se souvenir de moi
                    </label>
                    <button type="button" onClick={motDePasseOublie} className="text-sky-700 hover:underline">
                        Mot de passe oublié ?
                    </button>
                </div>

                {erreur && <div role="alert" className="alert alert-error alert-soft text-sm">{erreur}</div>}
                {info && <div role="status" className="alert alert-success alert-soft text-sm">{info}</div>}

                <button type="submit" disabled={load} className="w-full h-14 bg-sky-600 hover:bg-sky-700 disabled:opacity-70 rounded-xl text-white font-semibold duration-300 flex items-center justify-center gap-2">
                    {load && <span className="loading loading-spinner loading-sm"></span>}
                    Se connecter
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
                    Vous n&apos;avez pas de compte ?
                    <Link href="/inscription" className="text-sky-600 underline">Je m&apos;inscris</Link>
                </p>
            </form>
        </AuthLayout>
    )
}

export default Connexion
