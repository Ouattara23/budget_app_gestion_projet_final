"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import Modal from "./Modal"
import { AddTodatabase } from "@/lib/IndexDB/addToDB"
import { UpdateTodatabase } from "@/lib/IndexDB/updateDataToDB"
import { getSessionUser } from "@/lib/session"
import { moisCourant } from "@/lib/format"
import { BudgetType } from "@/types"

type Props = {
    open: boolean
    item: BudgetType | null // null = création, sinon modification
    onClose: () => void
    onSaved: (message: string) => void
}

// Une seule modale pour créer ET modifier un budget (remplace modalbudget + EditModalBudget)
function ModalBudget({ open, item, onClose, onSaved }: Props) {
    const [nomBudget, setNomBudget] = useState("")
    const [montant, setMontant] = useState("")
    const [mois, setMois] = useState(moisCourant())
    const [erreur, setErreur] = useState("")
    const [envoi, setEnvoi] = useState(false)

    // On réinitialise le formulaire à chaque ouverture
    useEffect(() => {
        if (!open) return
        setNomBudget(item?.nomBudget ?? "")
        setMontant(item ? String(item.montant) : "")
        setMois(item?.mois ?? moisCourant())
        setErreur("")
    }, [open, item])

    const enregistrer = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        const valeur = Number(montant)

        if (!nomBudget.trim()) return setErreur("Le nom du budget est requis.")
        if (!(valeur > 0)) return setErreur("Le montant doit être supérieur à 0.")
        if (!mois) return setErreur("Choisissez un mois.")

        setEnvoi(true)
        const data = { nomBudget: nomBudget.trim(), montant: valeur, mois }

        const termine = (ok: unknown) => {
            setEnvoi(false)
            if (!ok) return setErreur("Une erreur s'est produite, veuillez réessayer.")
            onSaved(item ? "Budget modifié" : "Budget ajouté")
            onClose()
        }

        if (item?.id !== undefined) {
            UpdateTodatabase("budgets", item.id, data, termine)
        } else {
            // La sauvegarde locale est prioritaire ; la synchro serveur ne doit pas la bloquer
            const userId = getSessionUser()?.id
            axios.post("/server/budgets/new-budget", { ...data, userId }).catch(() => console.warn("Budget non synchronisé avec le serveur"))
            AddTodatabase("budgets", { ...data, userId }, termine)
        }
    }

    return (
        <Modal open={open} onClose={onClose} titre={item ? "Modifier le budget" : "Nouveau budget"}>
            <form onSubmit={enregistrer} className="space-y-4">
                <label className="block">
                    <span className="block mb-1.5 font-medium">Nom du budget</span>
                    <input value={nomBudget} onChange={(e) => setNomBudget(e.target.value)} type="text" placeholder="Ex : Alimentation" className="input w-full bg-white" />
                </label>

                <label className="block">
                    <span className="block mb-1.5 font-medium">Montant (FCFA)</span>
                    <input value={montant} onChange={(e) => setMontant(e.target.value)} type="number" min="1" placeholder="100000" className="input w-full bg-white" />
                </label>

                <label className="block">
                    <span className="block mb-1.5 font-medium">Mois</span>
                    <input value={mois} onChange={(e) => setMois(e.target.value)} type="month" className="input w-full bg-white" />
                </label>

                {erreur && <div role="alert" className="alert alert-error alert-soft text-sm">{erreur}</div>}

                <div className="modal-action">
                    <button type="button" onClick={onClose} className="btn btn-ghost">Annuler</button>
                    <button type="submit" disabled={envoi} className="btn bg-sky-800 hover:bg-sky-900 text-white border-none">
                        {envoi && <span className="loading loading-spinner loading-sm"></span>}
                        Enregistrer
                    </button>
                </div>
            </form>
        </Modal>
    )
}

export default ModalBudget
