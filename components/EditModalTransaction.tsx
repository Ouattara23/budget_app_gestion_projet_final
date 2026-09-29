"use client"

import { UpdateTodatabase } from '@/lib/IndexDB/updateDataToDB'
import { BudgetType, TransactionType } from '@/types'
import { SetStateAction, useEffect, useState } from 'react'

function EditModalTransaction({item, listeBudgets, setListeBudgets}:{item:TransactionType | null,  listeBudgets: BudgetType[], setListeBudgets:React.Dispatch<SetStateAction<BudgetType[]>>}) {
    const [date, setDate] = useState(item?.date || "")
    const [objectif, setObjectif] = useState(item?.objectif || "")
    const [budgetId, setBudgetId] = useState(item?.budgetId || "")
    const [montant, setMontant] = useState(item?.montant || "")
    
    
    //const [budgetId, setBudgetId] = useState<string>("");
    //const [item, setItem] = useState<TransactionType | null
    const [listeTransactions, setListeTransactions] = useState<TransactionType[]>([]);
    //const [listeBudgets, setListeBudgets] = useState<BudgetType[]>([]);
    //const [listeBudgets, setListeBudgets] = useState<BudgetType[]>([]);

    const submitEditForm = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        const id = item?.id || null;
        if (!id) return;

        UpdateTodatabase("transactions", id, { date, objectif, budgetId, montant }, (e: React.SubmitEvent<HTMLFormElement>) => {
            if (!e) return;

            //On mets à jours aussi la varible ListeBudgets en créant d'abord un nouveau tableau avec map
            console.log("listeBudgets :", listeBudgets);
            const nouvelleListe = listeTransactions.map(transaction => ({ ...transaction, montant: Number(transaction.montant), }));

            setListeTransactions(nouvelleListe);

            //on ferme le modal
            document.getElementById("closeModal")?.click()
        })
    }

    useEffect(() => {
        if (item) {
            setDate(item.date)
            setObjectif(item.objectif)
            setBudgetId(item.budgetId)
            setMontant(item.montant)
        }
    }, [item])


    return (
        <>
            {/* The button to open modal */}
            <a href="#editmodal" className="btn" hidden id='openEditModalBTN'>open modal</a>

            {/* Put this part before </body> tag */}
            <div className="modal" role="dialog" id="editmodal">
                <div className="modal-box">
                    <h2 className='mb-3 font-bold'>Modification</h2>
                    <form onSubmit={(e) => submitEditForm(e)} className='flex flex-col gap-5'>
                        <input value={date} onChange={(e) => setDate(e.target.value)} className='input input-lg w-full' type="text" placeholder='Saisir la date' required />
                        <input value={objectif} onChange={(e) => setObjectif(e.target.value)} className='input input-lg w-full' type="text" placeholder='Saisir le nom du budget' required />
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
                        <input value={montant} onChange={(e) => setMontant(e.target.value)} className='input input-lg w-full' type="number" required />
                        
                        <div className="modal-action ">
                            <button className='btn bg-sky-900 text-white' type='submit'>Ajouter</button>
                            <a href="#" id='closeModal' className="btn bg-red-400 text-white">Annuler</a>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default EditModalTransaction
