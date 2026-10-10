"use client"

import axios from "axios"
import Link from "next/link"
import { useEffect, useState } from "react"
import Modal from "./Modal"
import { AddTodatabase } from "@/lib/IndexDB/addToDB"
import { UpdateTodatabase } from "@/lib/IndexDB/updateDataToDB"
import { resteDuBudget } from "@/lib/budgetStats"
import { dateHeureLocale, formatFCFA } from "@/lib/format"
import { getSessionUser } from "@/lib/session"
import { BudgetType, TransactionType } from "@/types"

type Props = {
    open: boolean
    item: TransactionType | null // null = création, sinon modification
    budgets: BudgetType[]
    transactions: TransactionType[]
    budgetParDefaut?: string // budget présélectionné à la création (ex. depuis la carte d'un budget)
    onClose: () => void
    onSaved: (message: string) => void
}

// Une seule modale pour ajouter ET modifier une transaction
function TransactionFormModal({ open, item, budgets, transactions, budgetParDefaut, onClose, onSaved }: Props) {
    const [date, setDate] = useState(dateHeureLocale())
    const [objectif, setObjectif] = useState("")
    const [budgetId, setBudgetId] = useState("")
    const [montant, setMontant] = useState("")
    const [erreur, setErreur] = useState("")
    const [envoi, setEnvoi] = useState(false)

    useEffect(() => {
        if (!open) return
        setDate(item?.date ?? dateHeureLocale())
        setObjectif(item?.objectif ?? "")
        setBudgetId(item ? String(item.budgetId) : budgetParDefaut ?? "")
        setMontant(item ? String(item.montant) : "")
        setErreur("")
    }, [open, item, budgetParDefaut])

    // Avertissement (non bloquant) si la dépense dépasse ce qu'il reste dans le budget choisi
    const budgetChoisi = budgets.find((b) => String(b.id) === budgetId)
    const autres = item ? transactions.filter((t) => t.id !== item.id) : transactions
    const reste = budgetChoisi ? resteDuBudget(budgetChoisi, autres) : null
    const depasse = reste !== null && Number(montant) > reste

    const enregistrer = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        const valeur = Number(montant)

        if (!date) return setErreur("La date est requise.")
        if (!objectif.trim()) return setErreur("L'objectif est requis.")
        if (!budgetId) return setErreur("Sélectionnez un budget.")
        if (!(valeur > 0)) return setErreur("Le montant doit être supérieur à 0.")

        setEnvoi(true)
        const data = { date, objectif: objectif.trim(), budgetId, montant: valeur }
        const remoteBudgetId = budgetChoisi?.remoteId ?? (typeof budgetChoisi?.id === "string" ? String(budgetChoisi.id) : undefined)

        try {
            if (item) {
                const remoteId = item.remoteId ?? (typeof item.id === "string" ? item.id : undefined)
                if (remoteId) {
                    await axios.patch(`/server/transactions/update-one/${encodeURIComponent(remoteId)}`, {
                        ...data,
                        budgetId: remoteBudgetId ?? budgetId,
                        localBudgetId: typeof budgetChoisi?.id === "number" ? String(budgetChoisi.id) : null,
                    })
                }

                if (typeof item.id === "number") {
                    const ok = await new Promise<boolean>((resolve) =>
                        UpdateTodatabase("transactions", item.id!, {
                            ...data,
                            remoteBudgetId,
                            localBudgetId: typeof budgetChoisi?.id === "number" ? String(budgetChoisi.id) : undefined,
                        }, (result: boolean) => resolve(result)),
                    )
                    if (!ok) throw new Error("La mise à jour locale a échoué")
                } else if (!remoteId) {
                    throw new Error("Identifiant de la transaction introuvable")
                }
            } else {
                const userId = getSessionUser()?.id
                axios.post("/server/transactions/new-transaction", {
                    ...data,
                    budgetId: remoteBudgetId ?? budgetId,
                    localBudgetId: budgetId,
                    userId,
                }).catch(() => console.warn("Transaction non synchronisée avec le serveur"))
                const ok = await new Promise<boolean>((resolve) =>
                    AddTodatabase("transactions", {
                        ...data,
                        userId,
                        remoteBudgetId,
                        dateAjout: new Date().toISOString(),
                    }, (result: boolean) => resolve(Boolean(result))),
                )
                if (!ok) throw new Error("L'ajout local a échoué")
            }

            onSaved(item ? "Transaction modifiée" : "Transaction ajoutée")
            onClose()
        } catch {
            setErreur("La modification a échoué. Vérifiez votre connexion puis réessayez.")
        } finally {
            setEnvoi(false)
        }
    }

    return (
        <Modal open={open} onClose={onClose} titre={item ? "Modifier la transaction" : "Nouvelle transaction"}>
            {budgets.length === 0 ? (
                <div className="space-y-4">
                    <p className="text-slate-600">Vous devez d&apos;abord créer un budget avant d&apos;enregistrer une dépense.</p>
                    <div className="modal-action">
                        <Link href="/mes-budgets" className="btn bg-sky-800 text-white border-none">Créer un budget</Link>
                    </div>
                </div>
            ) : (
                <form onSubmit={enregistrer} className="space-y-4">
                    <label className="block">
                        <span className="block mb-1.5 font-medium">Date et heure</span>
                        <input value={date} onChange={(e) => setDate(e.target.value)} type="datetime-local" className="input w-full bg-white" />
                    </label>

                    <label className="block">
                        <span className="block mb-1.5 font-medium">Objectif</span>
                        <input value={objectif} onChange={(e) => setObjectif(e.target.value)} type="text" placeholder="Ex : Courses du marché" className="input w-full bg-white" />
                    </label>

                    <label className="block">
                        <span className="block mb-1.5 font-medium">Budget</span>
                        <select value={budgetId} onChange={(e) => setBudgetId(e.target.value)} className="select w-full bg-white">
                            <option value="">Sélectionner un budget</option>
                            {budgets.map((b) => (
                                <option key={b.id} value={String(b.id)}>{b.nomBudget}</option>
                            ))}
                        </select>
                    </label>

                    <label className="block">
                        <span className="block mb-1.5 font-medium">Montant (FCFA)</span>
                        <input value={montant} onChange={(e) => setMontant(e.target.value)} type="number" min="1" placeholder="5000" className="input w-full bg-white" />
                    </label>

                    {depasse && reste !== null && (
                        <div role="status" className="alert alert-warning alert-soft text-sm">
                            Ce montant dépasse ce qu&apos;il reste dans ce budget ({formatFCFA(Math.max(reste, 0))}).
                        </div>
                    )}
                    {erreur && <div role="alert" className="alert alert-error alert-soft text-sm">{erreur}</div>}

                    <div className="modal-action">
                        <button type="button" onClick={onClose} className="btn btn-ghost">Annuler</button>
                        <button type="submit" disabled={envoi} className="btn bg-sky-800 hover:bg-sky-900 text-white border-none">
                            {envoi && <span className="loading loading-spinner loading-sm"></span>}
                            Enregistrer
                        </button>
                    </div>
                </form>
            )}
        </Modal>
    )
}

export default TransactionFormModal
