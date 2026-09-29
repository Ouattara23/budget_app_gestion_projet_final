"use client"
import { AddTodatabase } from '@/lib/IndexDB/addToDB'
import { BudgetType } from '@/types'
import axios from 'axios'
import React, { SetStateAction, useRef, useState } from 'react'
import { LuPlus } from 'react-icons/lu'


type StoredUser= {
    id?: string,
    nom: string
}
const serveur_url = "http://localhost:3000"

function ModalBudget({ listeBudgets, setListeBudgets }: { listeBudgets: BudgetType[], setListeBudgets: React.Dispatch<SetStateAction<BudgetType[]>> }) {

    // on crée les fonctions du formulaires
    const [nomBudget, setNomBudget] = useState("")
    const [montant, setMontant] = useState("")
    const [mois, setMois] = useState("")
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")
   /* const [budgets, setBudgets] = useState<BudgetType[]>([])
    const [user, setUser] = useState<StoredUser>()*/


    //on créé une reference au formulaire
    const formRef = useRef<HTMLFormElement>(null);


    //on ajoute les budgets dans indexDB

    //on ajoute les budgets dans indexDB
    const submitForm = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        setMessage("")

        const data = { nomBudget, montant, mois }
        if (typeof window === "undefined") {
            return;
        }

        //on fait appel à notre backend avec la methode post
        const req = await axios.post("/server/budgets/new-budget", {nomBudget, montant, mois})
        if(!req?.data) return;

        


        AddTodatabase("budgets", data, (e: React.SubmitEvent<HTMLFormElement>) => {
            if (!e) {
                setMessage("Une erreur s'est produite")
                return;
            }

            console.log("Transaction ajouté", e)

            setListeBudgets({...listeBudgets, ... data})
            formRef.current?.reset(); //Renitialise le formulaire
            document.getElementById("closeTransactiontModal")?.click()
            alert("Transaction ajouté avec succès")
        })

    }



    return (
        <div>
            <div className="mt-5 flex gap-10 items-center justify-center">
                <h3 className="font-semibold text-slate-600 text-2xl">Mes budgets</h3>
                {/* div modal pour enregistrer un nouveau budget */}
                <a className="btn bg-sky-900 text-white flex items-center justify-center" href='#nouveau_budget'>Nouveau Budget<LuPlus /> </a>
                <dialog id="nouveau_budget" role='dialog' className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-2xl mb-5 text-sky-900">Nouveau Budget</h3>

                        <form ref={formRef} onSubmit={(e) => submitForm(e)} className="space-y-2">
                            {/* Nom du budget */}
                            <div>
                                <label className="block mb-2 font-medium">
                                    Nom du budget
                                </label>
                                <input onChange={(e) => setNomBudget(e.target.value)} type="text" placeholder="Ex : Budget Alimentaire" className="input w-full focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500" />
                            </div>

                            {/* Montant */}
                            <div>
                                <label className="block mb-2 font-medium">
                                    Montant (FCFA)
                                </label>
                                <input onChange={(e) => setMontant(e.target.value)} type="number" placeholder="100000" className="input input-bordered w-full focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500" />
                            </div>
                            <div>
                                <label className="block mb-2 font-medium">
                                    Mois
                                </label>
                                <input onChange={(e) => setMois(e.target.value)} type="month" placeholder="Janvier" className="input input-bordered w-full focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500" />
                            </div>

                            <div className="modal-action">
                                <a href="#a" className="btn bg-gray-600 hover:bg-gray-700 text-white border-none" id="closeAjoutBudgetModal">
                                    Annuler
                                </a>

                                <button type="submit" className="btn bg-sky-800 hover:bg-sky-900 text-white border-none" >
                                    Enregistrer
                                </button>
                            </div>

                        </form>

                    </div>
                </dialog>
            </div>

        </div>
    )
}

export default ModalBudget
