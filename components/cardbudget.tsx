"use client"

import { useState } from "react"
import { LuPlus, LuReceipt, LuSquarePen, LuTrash2, LuWallet } from "react-icons/lu"
import Modal from "./Modal"
import ModalBudget from "./modalbudget"
import TransactionFormModal from "./TransactionFormModal"
import { useToast } from "./useToast"
import { useBudgetData } from "@/lib/useBudgetData"
import { DeleteToDB } from "@/lib/IndexDB/deleteToDB"
import { couleurProgression, depenseDuBudget, pourcentage } from "@/lib/budgetStats"
import { formatFCFA, formatMois } from "@/lib/format"
import { BudgetType } from "@/types"

const supprimer = (table: string, id: number | string) =>
    new Promise<boolean>((resolve) => DeleteToDB(table, id, (ok: boolean) => resolve(ok)))

// Page « Mes budgets » : cartes avec dépensé / reste / progression
function Cardbudget() {
    const { budgets, transactions, loading, refresh } = useBudgetData()
    const { afficher, ToastView } = useToast()

    const [formOuvert, setFormOuvert] = useState(false)
    const [aModifier, setAModifier] = useState<BudgetType | null>(null)
    const [aSupprimer, setASupprimer] = useState<BudgetType | null>(null)
    const [mois, setMois] = useState("") // vide = tous les mois
    const [transactionOuverte, setTransactionOuverte] = useState(false)
    const [budgetPourTransaction, setBudgetPourTransaction] = useState<string | undefined>(undefined)

    const liste = budgets
        .filter((b) => !mois || b.mois === mois)
        .sort((a, b) => (b.mois || "").localeCompare(a.mois || ""))

    const ouvrirCreation = () => {
        setAModifier(null)
        setFormOuvert(true)
    }

    const ouvrirModification = (budget: BudgetType) => {
        setAModifier(budget)
        setFormOuvert(true)
    }

    // budgetId fourni = bouton « Dépense » d'une carte (budget présélectionné) ; sinon bouton global
    const ouvrirTransaction = (budgetId?: string) => {
        setBudgetPourTransaction(budgetId)
        setTransactionOuverte(true)
    }

    const transactionsLiees = aSupprimer
        ? transactions.filter((t) => String(t.budgetId) === String(aSupprimer.id))
        : []

    // Supprimer un budget supprime aussi ses transactions (sinon elles restent orphelines)
    const confirmerSuppression = async () => {
        if (!aSupprimer || aSupprimer.id === undefined) return
        await Promise.all(transactionsLiees.map((t) => supprimer("transactions", t.id as number | string)))
        const ok = await supprimer("budgets", aSupprimer.id)
        setASupprimer(null)
        if (ok) {
            afficher("Budget supprimé")
            refresh()
        } else {
            afficher("La suppression a échoué", "error")
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <input type="month" value={mois} onChange={(e) => setMois(e.target.value)} aria-label="Filtrer par mois" className="input bg-white w-auto" />
                    {mois && (
                        <button onClick={() => setMois("")} className="btn btn-ghost btn-sm">Tous les mois</button>
                    )}
                </div>
                
                <div className="flex gap-2 sm:ml-auto">
                    <button onClick={() => ouvrirTransaction()} className="btn bg-white border-slate-300">
                    <LuReceipt /> Nouvelle transaction
                </button>
                <button onClick={ouvrirCreation} className="btn bg-sky-800 hover:bg-sky-900 text-white border-none">
                        <LuPlus /> Nouveau budget
                    </button>

                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {[1, 2, 3].map((i) => <div key={i} className="skeleton h-44 rounded-2xl"></div>)}
                </div>
            ) : liste.length === 0 ? (
                <div className="bg-white border border-dashed border-slate-300 rounded-2xl py-14 text-center">
                    <LuWallet className="mx-auto text-4xl text-slate-300 mb-3" />
                    <p className="text-slate-500 mb-4">
                        {mois ? "Aucun budget pour ce mois." : "Vous n'avez pas encore de budget."}
                    </p>
                    <button onClick={ouvrirCreation} className="btn bg-sky-800 text-white border-none">Créer un budget</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {liste.map((budget) => {
                        const depense = depenseDuBudget(budget, transactions)
                        const reste = Number(budget.montant) - depense
                        const pct = pourcentage(depense, Number(budget.montant))

                        return (
                            <div key={budget.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 space-y-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h2 className="font-bold text-lg text-slate-800">{budget.nomBudget}</h2>
                                        <p className="text-sm text-slate-500 capitalize">{formatMois(budget.mois)}</p>
                                    </div>
                                    <span className="font-bold text-sky-800 whitespace-nowrap">{formatFCFA(budget.montant)}</span>
                                </div>

                                <div>
                                    <div className="flex justify-between text-sm mb-1.5">
                                        <span className="text-slate-500">Dépensé : <b className="text-slate-700">{formatFCFA(depense)}</b></span>
                                        <span className="font-semibold text-slate-700">{pct}%</span>
                                    </div>
                                    <progress className={`progress w-full ${couleurProgression(pct)}`} value={Math.min(pct, 100)} max={100}></progress>
                                    <p className={`text-sm mt-1.5 font-medium ${reste < 0 ? "text-error" : "text-success"}`}>
                                        {reste < 0 ? `Dépassé de ${formatFCFA(-reste)}` : `Reste ${formatFCFA(reste)}`}
                                    </p>
                                </div>

                                <div className="flex flex-wrap justify-end gap-2">
                                    {/*<button onClick={() => ouvrirTransaction(String(budget.id))} className="btn btn-sm btn-outline border-sky-800 text-sky-800 hover:bg-sky-800 hover:text-white">
                                        <LuReceipt /> Dépense
                                    </button>*/}
                                    <button onClick={() => ouvrirModification(budget)} className="btn btn-sm bg-sky-900 text-white border-none">
                                        <LuSquarePen /> Modifier
                                    </button>
                                    <button onClick={() => setASupprimer(budget)} className="btn btn-sm btn-error text-white">
                                        <LuTrash2 /> Supprimer
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            <ModalBudget
                open={formOuvert}
                item={aModifier}
                onClose={() => setFormOuvert(false)}
                onSaved={(message) => {
                    afficher(message)
                    refresh()
                }}
            />

            <Modal open={aSupprimer !== null} onClose={() => setASupprimer(null)} titre="Supprimer ce budget ?">
                <p className="text-slate-600">
                    Le budget <b>{aSupprimer?.nomBudget}</b> sera supprimé définitivement
                    {transactionsLiees.length > 0 && <>, ainsi que ses <b>{transactionsLiees.length}</b> transaction(s)</>}.
                </p>
                <div className="modal-action">
                    <button onClick={() => setASupprimer(null)} className="btn btn-ghost">Annuler</button>
                    <button onClick={confirmerSuppression} className="btn btn-error text-white">Supprimer</button>
                </div>
            </Modal>

            <TransactionFormModal
                open={transactionOuverte}
                item={null}
                budgets={budgets}
                transactions={transactions}
                budgetParDefaut={budgetPourTransaction}
                onClose={() => setTransactionOuverte(false)}
                onSaved={(message) => {
                    afficher(message)
                    refresh()
                }}
            />

            {ToastView}
        </div>
    )
}

export default Cardbudget
