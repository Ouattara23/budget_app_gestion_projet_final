"use client"

import { InitAuth } from '@/fireBaseConfig'
import { AddTodatabase } from '@/lib/IndexDB/addToDB'
import { getAllDataTodatabase } from '@/lib/IndexDB/getAllDB'
import {  User } from '@/types'
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { LuChartColumnBig, LuEye, LuEyeOff, LuLock, LuMail, LuPhone, LuUser, LuWallet } from 'react-icons/lu'
import GoogleAuthBtn from './GoogleAuthBtn'
import axios from 'axios'



function Inscription() {
    //fonction des champs
    const [listeUsers, setlisteUsers] = useState<User[]>([])
    const [nom, setNom] = useState("");
    const [telephone, setTelephone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cpassword, setCpassword] = useState("");

    //formulaire
    const [showCpassword, setShowCpassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    //on créé une reference au formulaire
    const formRef = useRef<HTMLFormElement>(null)

    //définition des champs pour firebase
    //le load
    const [load, setLoad] = useState(false)

    //le toast
    const [toast, setToast] = useState(false)

    //le message d'erreur
    const [erreurMessage, setErreurMessage] = useState("")

    //on ajoute les utilisateurs dans indexDB
    const submitForm = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            setLoad(true)

            //on ajoute les users dans firrebase
            const data = await createUserWithEmailAndPassword(InitAuth, email, password)
            await updateProfile(data.user, {
                displayName: nom
            })

            //On envoi un email de confirmation de compte
            await sendEmailVerification(data.user)

            //on appel notre api backend
            const req = await axios.post("/server/users/new-user", {nom, telephone})
            if(!req?.data) return

            //On affiche le message de succès
            setToast(true)

        } catch (error: any) {
            const message = error?.message
            console.log("Erreur", message)
        }



        // indexDB
        const data = { nom, telephone, email, password, cpassword }
        if (typeof window === "undefined") {
            return;
        }
        AddTodatabase("users", data, (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e) {
                setlisteUsers([...listeUsers, data])
                const rep = e ? "Utilisateur ajouté avec succès" : "Une erreur s'est produite"
                formRef.current?.reset() //Renitialise le formulaire
            }
        })
    }
    //On recupère les taches dans indexDb quand le composant est monté (page totalement chargé)
    useEffect(() => {

        if (typeof window === "undefined") return;

        getAllDataTodatabase("users", (e: React.ChangeEvent<HTMLInputElement>) => {
            setlisteUsers(e)
        })

    }, [])



    return (
        <div>
            {/* inscription à la plateforme */}
            <section className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
                <div className="w-full max-w-7xl bg-white rounded-3xl shadow-xl overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        {/*  FORMULAIRE  */}
                        <div className="p-10 lg:p-10 flex flex-col justify-center">
                            {/* Logo */}
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-14 h-14 rounded-2xl bg-sky-600 flex items-center justify-center text-white">
                                    <LuWallet className='text-2xl' />
                                </div>

                                <div>
                                    <h2 className="text-3xl font-bold">
                                        Budget
                                        <span className="text-sky-600">App</span>
                                    </h2>

                                    <p className="text-gray-500 text-sm">
                                        Gérez votre budget en toute simplicité
                                    </p>
                                </div>

                            </div>

                            <div className='text-center'>
                                <h1 className="text-4xl font-bold mb-1">Inscription</h1>

                                <p className="text-gray-500 mb-3">
                                    Bienvenue ! Créer votre compte.
                                </p>
                            </div>

                            <form ref={formRef} onSubmit={(e) => submitForm(e)} className="space-y-3">
                                <div>
                                    <label className="block mb-1 font-medium"> Nom complet</label>

                                    <div className="flex items-center border rounded-xl px-4 h-14">
                                        <LuUser className='text-gray-500' />
                                        <input onChange={(e) => setNom(e.target.value)} type="text" placeholder="Votre nom complet" className="w-full ml-3 outline-none" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block mb-1 font-medium"> Téléphone</label>

                                    <div className="flex items-center border rounded-xl px-4 h-14">
                                        <LuPhone className='text-gray-500' />
                                        <input onChange={(e) => setTelephone(e.target.value)} type="number" placeholder="Votre numéro" className="w-full ml-3 outline-none" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block mb-1 font-medium"> Email</label>

                                    <div className="flex items-center border rounded-xl px-4 h-14">
                                        <LuMail className='text-gray-500' />
                                        <input onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Votre email" className="w-full ml-3 outline-none" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block mb-1 font-medium">Mot de passe</label>

                                    <div className="flex items-center border rounded-xl px-4 h-14">
                                        <LuLock className="text-gray-500" />

                                        <input onChange={(e) => setPassword(e.target.value)} type={showPassword ? "text" : "password"} placeholder="Entrez votre mot de passe" className="w-full ml-3 outline-none" />

                                        {showPassword ? (
                                            <LuEye
                                                onClick={() => setShowPassword(false)}
                                                className="text-gray-500 cursor-pointer"
                                            />
                                        ) : (
                                            <LuEyeOff
                                                onClick={() => setShowPassword(true)}
                                                className="text-gray-500 cursor-pointer"
                                            />
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block mb-1 font-medium">Confirmer Mot de passe</label>

                                    <div className="flex items-center border rounded-xl px-4 h-14">
                                        <LuLock className="text-gray-500" />

                                        <input onChange={(e) => setCpassword(e.target.value)} type={showCpassword ? "text" : "password"} placeholder="Confirmer votre mot de passe" className="w-full ml-3 outline-none"/>

                                        {showCpassword ? (
                                            <LuEye
                                                onClick={() => setShowCpassword(false)}
                                                className="text-gray-500 cursor-pointer"
                                            />
                                        ) : (
                                            <LuEyeOff
                                                onClick={() => setShowCpassword(true)}
                                                className="text-gray-500 cursor-pointer"
                                            />
                                        )}
                                    </div>
                                </div>

                                <button className="w-full h-14 bg-sky-600 hover:bg-sky-700 rounded-xl text-white font-semibold duration-300" type='submit'>
                                    Créer mon compte
                                </button>

                                <div className="flex items-center justify-center gap-3">
                                    <span className="w-15 h-px bg-gray-300"></span>
                                    <h4 className="text-gray-500">Ou</h4>
                                    <span className="w-15 h-px bg-gray-300"></span>
                                </div>


                                {/* connexion avec Google */}
                                <div className='flex items-center justify-center'>
                                    <GoogleAuthBtn/>
                                </div>

                                {/* Retour à la page d'inscription */}
                                <div>
                                    <p className="flex justify-center items-center gap-3">Vous avez déjà un compte ?
                                        <Link href="/connexion" className="text-sky-600 underline">Se connecter</Link>
                                    </p>
                                </div>
                            </form>

                        </div>

                        {/* IMAGE  */}

                        <div className="hidden lg:flex relative overflow-hidden">

                            {/* Image de fond */}
                            <img src="/images/image1.jpeg" alt="" className="absolute inset-0 w-full h-full object-cover" />

                            {/* Overlay noir transparent */}
                            <div className="absolute inset-0 bg-sky-700/50"></div>

                            {/* Contenu */}
                            <div className="absolute left-10 top-12 text-white z-20">

                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-sky-600 text-3xl mb-8">
                                    <LuChartColumnBig/>
                                </div>

                                <h2 className="text-5xl font-bold leading-tight">
                                    Maîtrisez <br />
                                    vos finances
                                </h2>

                                <p className="mt-6 text-indigo-100 max-w-sm">
                                    Suivez vos dépenses, gérez vos revenus
                                    et atteignez vos objectifs d'épargne.
                                </p>

                            </div>

                        </div>
                    </div>
                </div>
            </section>

        </div>
    )
}

export default Inscription
