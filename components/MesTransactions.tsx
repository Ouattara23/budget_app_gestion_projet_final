"use client"

import { useMemo, useState } from "react"
import { LuDownload, LuPen, LuPlus, LuSearch, LuTrash2 } from "react-icons/lu"
import Modal from "./Modal"
import TransactionFormModal from "./TransactionFormModal"
import { useToast } from "./useToast"
import { useBudgetData } from "@/lib/useBudgetData"
import { DeleteToDB } from "@/lib/IndexDB/deleteToDB"
import { formatDateHeure, formatFCFA, moisCourant } from "@/lib/format"
import { TransactionType } from "@/types"

const supprimer = (id: number | string) =>
    new Promise<boolean>((resolve) => DeleteToDB("transactions", id, (ok: boolean) => resolve(ok)))

// Page « Mes transactions » : filtres (période, budget, recherche), total, export CSV
function MesTransactions() {
    const { budgets, transactions, loading, refresh } = useBudgetData()
    const { afficher, ToastView } = useToast()

    const [periode, setPeriode] = useState("all")
    const [budgetFiltre, setBudgetFiltre] = useState("")
    const [recherche, setRecherche] = useState("")
    const [formOuvert, setFormOuvert] = useState(false)
    const [aModifier, setAModifier] = useState<TransactionType | null>(null)
    const [aSupprimer, setASupprimer] = useState<TransactionType | null>(null)

    const nomDuBudget = (id: string) => budgets.find((b) => String(b.id) === String(id))?.nomBudget ?? "Budget supprimé"

    const filtrees = useMemo(() => {
        const now = new Date()
        const debutMois = new Date(now.getFullYear(), now.getMonth(), 1)
        const debutMoisPrecedent = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        const debut3Mois = new Date(now.getFullYear(), now.getMonth() - 2, 1)
        const debutAnnee = new Date(now.getFullYear(), 0, 1)
        const terme = recherche.trim().toLowerCase()

        return transactions
            .filter((t) => {
                const d = new Date(t.date)
                if (periode === "current-month" && d < debutMois) return false
                if (periode === "last-month" && (d < debutMoisPrecedent || d >= debutMois)) return false
                if (periode === "3-months" && d < debut3Mois) return false
                if (periode === "year" && d < debutAnnee) return false
                if (budgetFiltre && String(t.budgetId) !== budgetFiltre) return false
                if (terme && !(t.objectif || "").toLowerCase().includes(terme)) return false
                return true
            })
            .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
    }, [transactions, periode, budgetFiltre, recherche])

    const total = filtrees.reduce((somme, t) => somme + Number(t.montant || 0), 0)

    const ouvrirCreation = () => {
        setAModifier(null)
        setFormOuvert(true)
    }

    const ouvrirModification = (transaction: TransactionType) => {
        setAModifier(transaction)
        setFormOuvert(true)
    }

    const confirmerSuppression = async () => {
        if (!aSupprimer || aSupprimer.id === undefined) return
        const ok = await supprimer(aSupprimer.id)
        setASupprimer(null)
        if (ok) {
            afficher("Transaction supprimée")
            refresh()
        } else {
            afficher("La suppression a échoué", "error")
        }
    }

    // Export compatible Excel français (séparateur « ; » et BOM UTF-8)
    const exporterCSV = () => {
        const lignes = [
            ["Date", "Objectif", "Budget", "Montant (FCFA)"],
            ...filtrees.map((t) => [formatDateHeure(t.date), t.objectif, nomDuBudget(t.budgetId), String(t.montant)]),
        ]
        const csv = "\uFEFF" + lignes.map((l) => l.map((c) => `"${c.replace(/"/g, '""')}"`).join(";")).join("\n")
        const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }))
        const lien = document.createElement("a")
        lien.href = url
        lien.download = `transactions-${moisCourant()}.csv`
        lien.click()
        URL.revokeObjectURL(url)
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
                <label className="input bg-white flex items-center gap-2 w-full sm:w-64">
                    <LuSearch className="text-slate-400" />
                    <input type="search" value={recherche} onChange={(e) => setRecherche(e.target.value)} placeholder="Rechercher un objectif" className="grow" />
                </label>

                <select value={periode} onChange={(e) => setPeriode(e.target.value)} aria-label="Période" className="select bg-white w-full sm:w-auto">
                    <option value="all">Toutes les transactions</option>
                    <option value="current-month">Ce mois-ci</option>
                    <option value="last-month">Le mois dernier</option>
                    <option value="3-months">3 derniers mois</option>
                    <option value="year">Cette année</option>
                </select>

                <select value={budgetFiltre} onChange={(e) => setBudgetFiltre(e.target.value)} aria-label="Budget" className="select bg-white w-full sm:w-auto">
                    <option value="">Tous les budgets</option>
                    {budgets.map((b) => (
                        <option key={b.id} value={String(b.id)}>{b.nomBudget}</option>
                    ))}
                </select>

                <div className="flex gap-2 sm:ml-auto">
                    <button onClick={exporterCSV} disabled={filtrees.length === 0} className="btn bg-white border-slate-300">
                        <LuDownload /> Exporter
                    </button>
                    <button onClick={ouvrirCreation} className="btn bg-sky-800 hover:bg-sky-900 text-white border-none">
                        <LuPlus /> Nouvelle transaction
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="skeleton h-64 rounded-2xl"></div>
            ) : filtrees.length === 0 ? (
                <div className="bg-white border border-dashed border-slate-300 rounded-2xl py-14 text-center text-slate-500">
                    {transactions.length === 0 ? "Aucune transaction enregistrée." : "Aucune transaction ne correspond à vos filtres."}
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-600">
                            <thead className="text-xs text-white uppercase bg-sky-900">
                                <tr>
                                    <th className="px-5 py-4">Date et heure</th>
                                    <th className="px-5 py-4">Objectif</th>
                                    <th className="px-5 py-4">Budget</th>
                                    <th className="px-5 py-4 text-right">Montant</th>
                                    <th className="px-5 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtrees.map((t) => (
                                    <tr key={t.id} className="border-t border-slate-200 hover:bg-slate-50">
                                        <td className="px-5 py-3 whitespace-nowrap">{formatDateHeure(t.date)}</td>
                                        <td className="px-5 py-3 font-medium text-slate-800">{t.objectif}</td>
                                        <td className="px-5 py-3"><span className="badge badge-soft badge-info">{nomDuBudget(t.budgetId)}</span></td>
                                        <td className="px-5 py-3 text-right font-semibold whitespace-nowrap">{formatFCFA(t.montant)}</td>
                                        <td className="px-5 py-3">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => ouvrirModification(t)} aria-label="Modifier" className="btn btn-sm btn-square bg-sky-800 text-white border-none"><LuPen /></button>
                                                <button onClick={() => setASupprimer(t)} aria-label="Supprimer" className="btn btn-sm btn-square btn-error text-white"><LuTrash2 /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="border-t-2 border-slate-200 bg-slate-50 font-semibold text-slate-800">
                                    <td className="px-5 py-3" colSpan={3}>Total ({filtrees.length} transaction{filtrees.length > 1 ? "s" : ""})</td>
                                    <td className="px-5 py-3 text-right whitespace-nowrap">{formatFCFA(total)}</td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            )}

            <TransactionFormModal
                open={formOuvert}
                item={aModifier}
                budgets={budgets}
                transactions={transactions}
                onClose={() => setFormOuvert(false)}
                onSaved={(message) => {
                    afficher(message)
                    refresh()
                }}
            />

            <Modal open={aSupprimer !== null} onClose={() => setASupprimer(null)} titre="Supprimer cette transaction ?">
                <p className="text-slate-600">
                    « {aSupprimer?.objectif} » ({aSupprimer ? formatFCFA(aSupprimer.montant) : ""}) sera supprimée définitivement.
                </p>
                <div className="modal-action">
                    <button onClick={() => setASupprimer(null)} className="btn btn-ghost">Annuler</button>
                    <button onClick={confirmerSuppression} className="btn btn-error text-white">Supprimer</button>
                </div>
            </Modal>

            {ToastView}
        </div>
    )
}

export default MesTransactions
