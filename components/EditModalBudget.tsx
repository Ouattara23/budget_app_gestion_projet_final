"use client"

import { UpdateTodatabase } from '@/lib/IndexDB/updateDataToDB'
import React, { useEffect, useState } from 'react'

function EditModalBudget({item, setListeBudgets, listeBudgets}) {
    const [nomBudget, setNomBudget] = useState(item?.nomBudget || "")
    const [montant, setMontant] = useState(item?.montant || "")
    const [mois, setMois] = useState(item?.mois || "")

    const submitEditForm = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        const id = item?.id || null;
        if (!id) return;

        UpdateTodatabase("budgets", id, { nomBudget, montant, mois }, (e: React.SubmitEvent<HTMLFormElement>) => {
            if (!e) return;

            //On mets à jours aussi la varible ListeBudgets en créant d'abord un nouveau tableau avec map
            const nouveauTableau = listeBudgets.map(item =>
                item.id === id ? { ...item, nomBudget, montant, mois } : item
            )

            setListeBudgets(nouveauTableau);

            //on ferme le modal
            document.getElementById("closeModal")?.click()
        })
    }

    useEffect(() => {
        if (item) {
            setNomBudget(item.nomBudget)
            setMontant(item.montant)
            setMois(item.mois)
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
                        <input value={nomBudget} onChange={(e) => setNomBudget(e.target.value)} className='input input-lg w-full' type="text" placeholder='Saisir le nom du budget' required />
                        <input value={montant} onChange={(e) => setMontant(e.target.value)} className='input input-lg w-full' type="number" required />
                        <input value={mois} onChange={(e) => setMois(e.target.value)} className='input input-lg w-full' type="month" required />
                        
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

export default EditModalBudget
