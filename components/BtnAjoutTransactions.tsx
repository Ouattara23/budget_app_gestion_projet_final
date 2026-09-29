"use client"

import { AddTodatabase } from '@/lib/IndexDB/addToDB';
import { MontTransaction } from '@/mes fonctions/MontTransaction';
import { BudgetType, TransactionType } from '@/types';
import axios from 'axios';
import { SetStateAction, useRef, useState } from 'react'
import { LuPlus } from 'react-icons/lu'

function BtnAjoutTransactions({listeBudgets, setListeBudgets}:{listeBudgets: BudgetType[], setListeBudgets:React.Dispatch<SetStateAction<BudgetType[]>>}) {
    const [listeTransactions, setListeTransactions] = useState<TransactionType[]>([]);
    //const [listeBudgets, setListeBudgets] = useState<BudgetType[]>([]);
    const [budgetId, setBudgetId] = useState<string>("");

    const [date, setDate] = useState("");
    const [objectif, setObjectif] = useState("");
    const [montant, setMontant] = useState("");
    const [message, setMessage] = useState("");

    //on créé une reference au formulaire
    const formRef = useRef<HTMLFormElement>(null);
    

    //on ajoute les budgets dans indexDB
    const submitForm = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        setMessage("")
        const data = { date, objectif, budgetId, montant }
        if (typeof window === "undefined") {
            return;
        }
        // on fait appel a ma fonction
        

        //on fait appel à notre backend
        const req = await axios.post("/server/transactions/new-transaction", {date, objectif, budgetId, montant})
        if(!req?.data) return;

        AddTodatabase("transactions", data, (e: React.SubmitEvent<HTMLFormElement>) => {
            if (!e) {
                setMessage("Une erreur s'est produite")
                return;
            }

            console.log("Transaction ajouté", e)

            setListeTransactions({...listeTransactions, ... data})
            formRef.current?.reset(); //Renitialise le formulaire
            document.getElementById("closeTransactiontModal")?.click()
            alert("Transaction ajouté avec succès")
        })
    }


    return (
        <>
            <div className="mt-5 flex justify-end">
                {/*<h3 className="font-semibold text-slate-600 text-2xl">Mes budgets</h3>*/}
                {/* div modal pour enregistrer un nouveau budget */}
                <a className="btn bg-sky-900 text-white flex items-center h-12 w-12 rounded-full justify-center" href='#nouveau_budget'><LuPlus className='text-2xl' /> </a>
                <dialog id="nouveau_budget" role='dialog' className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-2xl mb-5 text-sky-900">Nouvelle Transaction</h3>

                        <form ref={formRef} onSubmit={(e) => submitForm(e)} className="space-y-2">
                            <div>
                                <label className="block mb-2 font-medium">
                                    Date
                                </label>
                                <input onChange={(e) => setDate(e.target.value)} type="datetime-local" placeholder="Janvier" className="input input-bordered w-full focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500" />
                            </div>
                            {/* objectif */}
                            <div>
                                <label className="block mb-2 font-medium">
                                    Objectif
                                </label>
                                <input onChange={(e) => setObjectif(e.target.value)} type="text" placeholder="Ex : Budget Alimentaire" className="input w-full focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500" />
                            </div>

                            {/* Budget */}
                            <div>
                                <label className="block mb-2 font-medium">
                                    Budget
                                </label>

                                <select value={budgetId} onChange={(e) => setBudgetId(e.target.value)} className="select select-bordered outline-none w-full focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500" >
                                    <option value="">
                                        Sélectionner un budget
                                    </option>

                                    {
                                    listeBudgets.map(budgets => (
                                        <option key={budgets.id} value={budgets.id}>
                                            {budgets.nomBudget}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Montant */}
                            <div>
                                <label className="block mb-2 font-medium">
                                    Montant (FCFA)
                                </label>
                                <input onChange={(e) => setMontant(e.target.value)} type="number" placeholder="100000" className="input input-bordered w-full focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500" />
                            </div>


                            <div className="modal-action">
                                <a href="#a" className="btn bg-gray-600 hover:bg-gray-700 text-white border-none" id="closeTransactiontModal">
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

        </>
    )
}

export default BtnAjoutTransactions
