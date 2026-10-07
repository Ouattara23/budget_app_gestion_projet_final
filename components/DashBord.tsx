"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { LuChartColumnBig, LuShoppingCart, LuWallet } from "react-icons/lu"
import { useBudgetData } from "@/lib/useBudgetData"
import { couleurProgression, depenseDuBudget, pourcentage } from "@/lib/budgetStats"
import { formatDateHeure, formatFCFA, formatMois, moisCourant } from "@/lib/format"

function CarteStat({ titre, valeur, icone, couleur }: { titre: string; valeur: string; icone: React.ReactNode; couleur: string }) {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between gap-4">
            <div>
                <p className="text-sm text-slate-500">{titre}</p>
                <p className={`text-2xl font-bold mt-1 ${couleur}`}>{valeur}</p>
            </div>
            <div className="w-12 h-12 shrink-0 rounded-full bg-slate-100 flex items-center justify-center text-xl text-slate-700">{icone}</div>
        </div>
    )
}

// Tableau de bord : chiffres réels du mois choisi (les valeurs étaient codées en dur auparavant)
function DashBord() {
    const { budgets, transactions, loading } = useBudgetData()
    const [mois, setMois] = useState(moisCourant())

    const budgetsDuMois = useMemo(() => budgets.filter((b) => b.mois === mois), [budgets, mois])
    const transactionsDuMois = useMemo(
        () =>
            transactions
                .filter((t) => (t.date || "").slice(0, 7) === mois)
                .sort((a, b) => (b.date || "").localeCompare(a.date || "")),
        [transactions, mois]
    )

    const alloue = budgetsDuMois.reduce((s, b) => s + Number(b.montant || 0), 0)
    const depense = transactionsDuMois.reduce((s, t) => s + Number(t.montant || 0), 0)
    const reste = alloue - depense
    const pct = pourcentage(depense, alloue)

    const nomDuBudget = (id: string) => budgets.find((b) => String(b.id) === String(id))?.nomBudget ?? "Budget supprimé"

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-slate-500">
                    Vue d&apos;ensemble de <span className="font-semibold text-slate-700 capitalize">{formatMois(mois)}</span>
                </p>
                <input type="month" value={mois} onChange={(e) => setMois(e.target.value || moisCourant())} aria-label="Mois affiché" className="input bg-white w-auto" />
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => <div key={i} className="skeleton h-28 rounded-2xl"></div>)}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <CarteStat titre="Budget alloué" valeur={formatFCFA(alloue)} icone={<LuWallet />} couleur="text-sky-800" />
                        <CarteStat titre="Dépensé ce mois" valeur={formatFCFA(depense)} icone={<LuShoppingCart />} couleur="text-violet-700" />
                        <CarteStat titre="Reste disponible" valeur={formatFCFA(reste)} icone={<LuChartColumnBig />} couleur={reste < 0 ? "text-error" : "text-success"} />
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium text-slate-700">Budget utilisé</span>
                            <span className="font-semibold text-slate-800">{pct}%</span>
                        </div>
                        <progress className={`progress w-full ${couleurProgression(pct)}`} value={Math.min(pct, 100)} max={100}></progress>
                        {reste < 0 && alloue > 0 && (
                            <p className="text-sm text-error mt-2">Vous avez dépassé votre budget du mois de {formatFCFA(-reste)}.</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-bold text-slate-800">Budgets du mois</h2>
                                <Link href="/mes-budgets" className="text-sm text-sky-700 hover:underline">Gérer</Link>
                            </div>

                            {budgetsDuMois.length === 0 ? (
                                <p className="text-slate-500 text-sm py-6 text-center">
                                    Aucun budget pour ce mois. <Link href="/mes-budgets" className="text-sky-700 underline">Créer un budget</Link>
                                </p>
                            ) : (
                                <ul className="space-y-4">
                                    {budgetsDuMois.map((b) => {
                                        const dep = depenseDuBudget(b, transactions)
                                        const p = pourcentage(dep, Number(b.montant))
                                        return (
                                            <li key={b.id}>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="font-medium text-slate-700">{b.nomBudget}</span>
                                                    <span className="text-slate-500">{formatFCFA(dep)} / {formatFCFA(b.montant)}</span>
                                                </div>
                                                <progress className={`progress w-full ${couleurProgression(p)}`} value={Math.min(p, 100)} max={100}></progress>
                                            </li>
                                        )
                                    })}
                                </ul>
                            )}
                        </section>

                        <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-bold text-slate-800">Dernières transactions</h2>
                                <Link href="/mes-transactions" className="text-sm text-sky-700 hover:underline">Voir tout</Link>
                            </div>

                            {transactionsDuMois.length === 0 ? (
                                <p className="text-slate-500 text-sm py-6 text-center">
                                    Aucune transaction ce mois-ci. <Link href="/mes-transactions" className="text-sky-700 underline">Ajouter une dépense</Link>
                                </p>
                            ) : (
                                <ul className="divide-y divide-slate-100">
                                    {transactionsDuMois.slice(0, 6).map((t) => (
                                        <li key={t.id} className="flex items-center justify-between gap-3 py-3">
                                            <div className="min-w-0">
                                                <p className="font-medium text-slate-800 truncate">{t.objectif}</p>
                                                <p className="text-xs text-slate-500">{nomDuBudget(t.budgetId)} · {formatDateHeure(t.date)}</p>
                                            </div>
                                            <span className="font-semibold text-slate-800 whitespace-nowrap">- {formatFCFA(t.montant)}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>
                    </div>
                </>
            )}
        </div>
    )
}

export default DashBord
