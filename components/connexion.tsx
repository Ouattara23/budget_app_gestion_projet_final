"use client"
import { InitAuth } from '@/fireBaseConfig'
import { LoginUser } from '@/lib/LoginUser'
import { signInWithEmailAndPassword } from 'firebase/auth'
import type { User as FirebaseUser } from 'firebase/auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { LuChartColumnBig, LuEye, LuEyeOff, LuLock, LuMail, LuWallet } from 'react-icons/lu'
import GoogleAuthBtn from './GoogleAuthBtn'


function Connexion() {
    //Définir le champ password
    const [showPassword, setShowPassword] = useState("")

    //Le loader
    const [load, setLoad] = useState(false)

    //Toast de succes
    const [toast, setToast] = useState(false)

    //Pour afficher les messages d'erreur
    const [errMessage, setErrMessage] = useState("")

    //importation de la page loginUser

    // router direction sur le tableau de bord
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {

            setLoad(true) //On active le loader du bouton

            //On ajoute le users dans firebase
            const data = await signInWithEmailAndPassword(InitAuth, email, password)

            //On verifie que l'email est verifié
            /*if (!data?.user?.emailVerified) {
                await sendEmailVerification(data.user) //On renvoie l'email de verification
                alert("Votre compte n'est pas encore verifié, un mail vous a été envoyé pour l'activer")
                return;
            }*/

            if (typeof window !== "undefined") {
                localStorage.setItem("user", JSON.stringify({
                    id: data.user.uid,
                    nom: data.user.displayName
                }))
            }

            //On affiche le message de succès
            setToast(true)


        } catch (error: any) {

            const message = error?.message
            console.log("Erreur: ", message)

        } finally {

            setLoad(false)
        }

        LoginUser(email, password, (user: FirebaseUser) => {

            if (user) {
                localStorage.setItem("user", JSON.stringify(user));

                router.push("/dashbord");
            } else {
                alert("Email ou mot de passe incorrect");
            }

        });
    };


    return (
        <div>
            {/* connexion à la plateforme */}
            <section className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
                <div className="w-full max-w-7xl bg-white rounded-3xl shadow-xl overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        {/*  FORMULAIRE  */}
                        <div className="p-10 lg:p-16 flex flex-col justify-center">
                            {/* Logo */}
                            <div className="flex items-center gap-3 mb-12 ">
                                <div className="w-14 h-14 rounded-2xl bg-sky-800 flex items-center justify-center text-white">
                                    <LuWallet />
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
                                <h1 className="text-4xl font-bold mb-2">
                                    Connexion
                                </h1>

                                <p className="text-gray-500 mb-8">
                                    Bienvenue ! Connectez-vous à votre compte.
                                </p>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-6">
                                <div>
                                    <label className="block mb-2 font-medium">
                                        Email
                                    </label>

                                    <div className="flex items-center border rounded-xl px-4 h-14">
                                        <LuMail className='text-gray-500' />
                                        <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder="Votre email" className="w-full ml-3 outline-none" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block mb-2 font-medium">
                                        Mot de passe
                                    </label>

                                    <div className="flex items-center border rounded-xl px-4 h-14">
                                        <LuLock className="text-gray-500" />

                                        <input onChange={(e) => setPassword(e.target.value)} value={password} type={showPassword ? "text" : "password"} placeholder="Entrez votre mot de passe" className="w-full ml-3 outline-none" />

                                        {showPassword ? (
                                            <LuEye onClick={() => setShowPassword(false)} className="text-gray-500 cursor-pointer" />
                                        ) : (
                                            <LuEyeOff onClick={() => setShowPassword(true)} className="text-gray-500 cursor-pointer" />
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-between items-center text-sm">
                                    <label className="flex items-center gap-2">
                                        <input type="checkbox" />
                                        Se souvenir de moi
                                    </label>

                                    <a href="#" className="text-sky-800 hover:underline">
                                        Mot de passe oublié ?
                                    </a>

                                </div>

                                <button className="w-full h-14 bg-sky-600 hover:bg-sky-700 rounded-xl text-white font-semibold duration-300">
                                    Se connecter
                                </button>

                                <div className="flex items-center justify-center gap-3">
                                    <span className="w-15 h-px bg-gray-300"></span>
                                    <h4 className="text-gray-500">Ou</h4>
                                    <span className="w-15 h-px bg-gray-300"></span>
                                </div>

                                {/* connexion avec Google */}
                                <div className='flex items-center justify-center'>
                                    <GoogleAuthBtn />
                                </div>

                                {/* Retour à la page d'inscription */}
                                <div>
                                    <p className="flex justify-center items-center gap-3">Vous n'avez pas de compte ?
                                        <Link href="/inscription" className="text-sky-600 underline">Je m'inscris</Link>
                                    </p>
                                </div>
                            </form>

                        </div>

                        {/* IMAGE  */}

                        <div className="hidden lg:flex relative overflow-hidden">

                            {/* Image de fond */}
                            <img src="/images/image1.jpeg" alt="" className="absolute inset-0 w-full h-full object-cover bg-center" />

                            {/* Overlay noir transparent */}
                            <div className="absolute inset-0 bg-sky-700/50"></div>

                            {/* Contenu */}
                            <div className="absolute left-10 top-12 text-white z-20 ">
                                {/* texte */}
                                <div>
                                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-sky-600 text-3xl mb-8">
                                        <i className="bi bi-bar-chart"></i>
                                        <LuChartColumnBig />
                                    </div>

                                    <div className=''>
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
                    </div>
                </div>
            </section>

        </div>
    )
}

export default Connexion
