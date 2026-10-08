"use client"

import { InitAuth, InitStorage } from "@/fireBaseConfig"
import { getSessionUser } from "@/lib/session"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { updateProfile } from "firebase/auth"
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react"
import { LuCamera, LuCheck, LuMail, LuPhone, LuSave, LuUserRound } from "react-icons/lu"

type Profil = { nom?: string; telephone?: string; email?: string; photoURL?: string }

async function televerserPhoto(destination: ReturnType<typeof ref>, image: Blob): Promise<string> {
    const resultat = await uploadBytes(destination, image, { contentType: image.type || "image/jpeg" })
    return getDownloadURL(resultat.ref)
}

export default function MonCompte() {
    const [nom, setNom] = useState("")
    const [telephone, setTelephone] = useState("")
    const [email, setEmail] = useState("")
    const [photoURL, setPhotoURL] = useState("")
    const [photo, setPhoto] = useState<File | null>(null)
    const [enregistrement, setEnregistrement] = useState(false)
    const [etapeEnregistrement, setEtapeEnregistrement] = useState<"envoi" | "profil" | null>(null)
    const [message, setMessage] = useState("")
    const [erreur, setErreur] = useState("")
    const champsModifies = useRef({ nom: false, telephone: false, photo: false })

    useEffect(() => {
        const utilisateur = InitAuth.currentUser
        if (!utilisateur) return

        setNom(utilisateur.displayName ?? "")
        setEmail(utilisateur.email ?? "")
        setPhotoURL(utilisateur.photoURL ?? "")

        fetch(`/server/users/${encodeURIComponent(utilisateur.uid)}`)
            .then(async (response) => response.ok ? await response.json() as Profil : {})
            .then((profil: Profil) => {
                if (!champsModifies.current.nom) setNom(profil.nom || utilisateur.displayName || "")
                if (!champsModifies.current.telephone) setTelephone(profil.telephone || "")
                if (!champsModifies.current.photo) setPhotoURL(profil.photoURL || utilisateur.photoURL || "")
            })
            .catch(() => setErreur("Les informations du profil n’ont pas pu être chargées."))
    }, [])

    const choisirPhoto = (event: ChangeEvent<HTMLInputElement>) => {
        const fichier = event.target.files?.[0]
        if (!fichier) return
        if (!fichier.type.startsWith("image/")) {
            setErreur("Choisissez un fichier image.")
            return
        }
        if (fichier.size > 5 * 1024 * 1024) {
            setErreur("La photo doit peser 5 Mo ou moins.")
            return
        }
        setErreur("")
        setMessage("")
        champsModifies.current.photo = true
        setPhoto(fichier)
        setPhotoURL(URL.createObjectURL(fichier))
    }

    const enregistrer = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const utilisateur = InitAuth.currentUser
        if (!utilisateur) {
            setErreur("Reconnectez-vous pour modifier votre profil.")
            return
        }
        if (!nom.trim()) {
            setErreur("Votre nom est requis.")
            return
        }

        setEnregistrement(true)
        setEtapeEnregistrement(photo ? "envoi" : "profil")
        setErreur("")
        setMessage("")
        try {
            let nouvellePhoto = utilisateur.photoURL ?? ""
            if (photo) {
                const destination = ref(InitStorage, `utilisateurs/${utilisateur.uid}/photo-profil`)
                nouvellePhoto = await televerserPhoto(destination, photo)
            }

            setEtapeEnregistrement("profil")
            const nouveauNom = nom.trim()
            const miseAJourFirebase = utilisateur.displayName !== nouveauNom || utilisateur.photoURL !== nouvellePhoto
                ? updateProfile(utilisateur, { displayName: nouveauNom, photoURL: nouvellePhoto || null })
                : Promise.resolve()
            const sauvegardeProfil = fetch("/server/users/new-user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: utilisateur.uid,
                    nom: nouveauNom,
                    telephone: telephone.trim(),
                    email: utilisateur.email ?? email,
                    photoURL: nouvellePhoto,
                }),
            })
            const [response] = await Promise.all([sauvegardeProfil, miseAJourFirebase])
            if (!response.ok) throw new Error("La sauvegarde du profil a échoué.")

            setPhoto(null)
            setPhotoURL(nouvellePhoto)
            setMessage("Votre profil a été mis à jour.")
        } catch (cause) {
            setErreur(cause instanceof Error ? cause.message : "Une erreur est survenue pendant la sauvegarde.")
        } finally {
            setEnregistrement(false)
            setEtapeEnregistrement(null)
        }
    }

    const nomSession = getSessionUser()?.nom

    return (
        <div className="workspace-page mx-auto max-w-5xl space-y-7 pb-8 pt-5 px-5">
            <header className="flex flex-col gap-4 border-b border-slate-200/80 pb-6 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex items-start gap-4">
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-800 shadow-sm shadow-blue-900/5">
                        <LuUserRound className="size-5" />
                    </span>
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-blue-800">Espace personnel</p>
                        <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-[28px]">Paramètres du compte</h2>
                        <p className="mt-1.5 max-w-xl text-sm leading-6 text-slate-500">Gérez les informations associées à votre profil BudgetApp.</p>
                    </div>
                </div>
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-2 text-xs font-semibold text-blue-800 shadow-sm">
                    <span className="flex size-5 items-center justify-center rounded-full bg-blue-100"><LuCheck className="size-3" /></span>
                    Profil personnel
                </div>
            </header>

            <form onSubmit={enregistrer} className="space-y-5">
                <div className="grid gap-5 lg:grid-cols-[0.82fr_1.18fr]">
                    <section className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-[0_12px_36px_rgba(20,60,43,0.055)]">
                        <div className="h-24 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-200 via-blue-100 to-[#f5faf7]" />
                        <div className="px-6 pb-6">
                            <div className="-mt-12 flex items-end justify-between">
                                <div className="relative flex size-24 items-center justify-center overflow-hidden rounded-[1.65rem] border-4 border-white bg-blue-700 text-white shadow-lg shadow-blue-950/15">
                                    {photoURL ? <img src={photoURL} alt="photo de profil" className="size-full object-cover" /> : <span className="text-3xl font-bold">{nom.trim().charAt(0).toUpperCase() || <LuUserRound className="size-9" />}</span>}
                                </div>
                                <span className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1.5 text-[11px] font-semibold text-blue-800">
                                    <span className="size-1.5 rounded-full bg-blue-500" /> Compte actif
                                </span>
                            </div>
                            <div className="mt-4">
                                <h3 className="truncate text-lg font-bold text-slate-900">{nom.trim() || "Votre profil"}</h3>
                                <p className="mt-1 truncate text-sm text-slate-500">{email || "Adresse email non renseignée"}</p>
                            </div>
                            <div className="mt-6 border-t border-slate-100 pt-5">
                                <p className="text-sm font-semibold text-slate-800">Photo de profil</p>
                                <p className="mt-1 text-xs leading-5 text-slate-500">Choisissez une image nette pour reconnaître facilement votre espace.</p>
                                <label className="mt-4 inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50/60 hover:text-blue-800 focus-within:ring-2 focus-within:ring-blue-200">
                                    <LuCamera className="size-4" /> Choisir une photo
                                    <input type="file" accept="image/*" onChange={choisirPhoto} className="sr-only" aria-label="Choisir une photo de profil" />
                                </label>
                                <p className="mt-2 text-center text-[11px] text-slate-400">Image · 5 Mo maximum</p>
                                {nomSession && <p className="mt-4 rounded-xl bg-slate-50 px-3 py-2.5 text-xs text-slate-500">Connecté en tant que <span className="font-semibold text-slate-700">{nomSession}</span></p>}
                            </div>
                        </div>
                    </section>

                    <section className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_12px_36px_rgba(20,60,43,0.045)] sm:p-7">
                        <div className="mb-8 border-b border-slate-100 pb-6">
                            <h3 className="text-base font-bold text-slate-900">Informations personnelles</h3>
                            <p className="mt-1 text-sm text-slate-500">Ces informations vous aident à personnaliser votre espace.</p>
                        </div>
                        <div className="space-y-7">
                            <label className="form-control flex w-full flex-col items-stretch gap-2.5">
                                <span className="block text-xs font-bold text-slate-700">Nom complet</span>
                                <span className="flex min-h-12 w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
                                    <LuUserRound className="size-4 shrink-0 text-slate-400" />
                                    <input type="text" required maxLength={80} autoComplete="name" value={nom} onChange={(event) => { champsModifies.current.nom = true; setNom(event.target.value) }} placeholder="Votre nom complet" className="min-w-0 grow bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400" />
                                </span>
                            </label>
                            <label className="form-control flex w-full flex-col items-stretch gap-2.5">
                                <span className="block text-xs font-bold text-slate-700">Adresse email</span>
                                <span className="flex min-h-12 w-full items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5">
                                    <LuMail className="size-4 shrink-0 text-slate-400" />
                                    <input type="email" value={email} readOnly aria-describedby="email-note" className="min-w-0 grow bg-transparent text-sm text-slate-500 outline-none" />
                                    <span className="hidden rounded-md bg-white px-2 py-1 text-[10px] font-semibold text-slate-400 sm:inline">FIXE</span>
                                </span>
                                <span id="email-note" className="text-xs leading-5 text-slate-400">L’adresse liée à votre connexion ne peut pas être modifiée ici.</span>
                            </label>
                            <label className="form-control flex w-full flex-col items-stretch gap-2.5">
                                <span className="block text-xs font-bold text-slate-700">Téléphone <span className="font-normal text-slate-400">· facultatif</span></span>
                                <span className="flex min-h-12 w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
                                    <LuPhone className="size-4 shrink-0 text-slate-400" />
                                    <input type="tel" autoComplete="tel" value={telephone} onChange={(event) => { champsModifies.current.telephone = true; setTelephone(event.target.value) }} placeholder="Ex. +225 07 00 00 00 00" className="min-w-0 grow bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400" />
                                </span>
                            </label>
                        </div>
                    </section>
                </div>

                {erreur && <div role="alert" className="alert alert-error alert-soft rounded-2xl text-sm">{erreur}</div>}
                {message && <div role="status" className="alert alert-success alert-soft rounded-2xl text-sm">{message}</div>}

                <div className="flex flex-col-reverse gap-3 border-t border-slate-200/80 pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs leading-5 text-slate-400">Pensez à enregistrer vos changements avant de quitter cette page.</p>
                    <button type="submit" disabled={enregistrement} className="btn min-h-12 rounded-xl border-0 bg-blue-800 px-5 text-white shadow-md shadow-blue-950/10 transition hover:-translate-y-0.5 hover:bg-blue-900 disabled:translate-y-0 disabled:opacity-60">
                        {enregistrement ? <span className="loading loading-spinner loading-sm" /> : <LuSave className="size-4" />}
                        {enregistrement ? etapeEnregistrement === "envoi" ? "Envoi de la photo…" : "Finalisation…" : "Enregistrer les modifications"}
                    </button>
                </div>
            </form>
        </div>
    )
}
