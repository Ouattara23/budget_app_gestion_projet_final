"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { LuArrowDownRight, LuArrowRight, LuChartNoAxesCombined, LuPlus, LuReceipt, LuWallet } from "react-icons/lu"
import { useBudgetData } from "@/lib/useBudgetData"
import { couleurProgression, depenseDuBudget, pourcentage } from "@/lib/budgetStats"
import { formatDateHeure, formatFCFA, formatMois, moisCourant } from "@/lib/format"

function DashBord() {
    const { budgets, transactions, loading } = useBudgetData()
    const [mois, setMois] = useState(moisCourant())

    const budgetsDuMois = useMemo(() => budgets.filter((b) => b.mois === mois), [budgets, mois])
    const transactionsDuMois = useMemo(
        () => transactions
            .filter((t) => (t.date || "").slice(0, 7) === mois)
            .sort((a, b) => (b.date || "").localeCompare(a.date || "")),
        [transactions, mois]
    )

    const alloue = budgetsDuMois.reduce((s, b) => s + Number(b.montant || 0), 0)
    const depense = transactionsDuMois.reduce((s, t) => s + Number(t.montant || 0), 0)
    const reste = alloue - depense
    const pct = pourcentage(depense, alloue)
    const nomDuBudget = (id: string) => budgets.find((b) => String(b.id) === String(id))?.nomBudget ?? "Budget supprimé"
    const couleurJauge = pct > 100 ? "#f43f5e" : pct >= 75 ? "#f59e0b" : "#10b981"

    return (
        <div className="workspace-page dashboard-page space-y-6">
            <section className="dashboard-hero">
                <div className="dashboard-hero-top">
                    <div>
                        <p className="dashboard-kicker">Votre aperçu financier</p>
                        <h2>Gardez le cap sur vos dépenses.</h2>
                        <p className="dashboard-period">Suivi de <span>{formatMois(mois)}</span></p>
                    </div>
                    <label className="dashboard-month" aria-label="Choisir le mois affiché">
                        <span>Mois affiché</span>
                        <input type="month" value={mois} onChange={(e) => setMois(e.target.value || moisCourant())} />
                    </label>
                </div>

                {loading ? (
                    <div className="dashboard-loading" aria-label="Chargement des données financières">
                        <div><span /><span /><span /></div>
                        <span className="dashboard-loading-ring" />
                        <div><span /><span /><span /></div>
                    </div>
                ) : (
                    <div className="dashboard-overview">
                        <div className="dashboard-balance">
                            <span className="dashboard-label">Reste disponible</span>
                            <strong>{formatFCFA(reste)}</strong>
                            <span className={`dashboard-status ${reste < 0 ? "is-over" : ""}`}>
                                <span className="dashboard-status-dot" />
                                {reste < 0 ? "Budget dépassé" : "Vous êtes dans votre budget"}
                            </span>
                        </div>

                        <div className="dashboard-ring-wrap" role="img" aria-label={`${pct}% du budget utilisé`}>
                            <div className="dashboard-ring" style={{ background: `conic-gradient(${couleurJauge} ${Math.min(pct, 100) * 3.6}deg, rgba(255,255,255,.16) 0deg)` }}>
                                <div className="dashboard-ring-inner">
                                    <strong>{pct}%</strong>
                                    <span>utilisé</span>
                                </div>
                            </div>
                        </div>

                        <div className="dashboard-totals">
                            <div>
                                <span className="dashboard-label"><span className="dashboard-legend-dot is-budget" />Budget alloué</span>
                                <strong>{formatFCFA(alloue)}</strong>
                            </div>
                            <div>
                                <span className="dashboard-label"><span className="dashboard-legend-dot is-spent" />Dépensé</span>
                                <strong>{formatFCFA(depense)}</strong>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {!loading && (
                <>
                    {reste < 0 && alloue > 0 && (
                        <div className="dashboard-alert" role="status">
                            <LuArrowDownRight aria-hidden="true" />
                            <span>Vous avez dépassé votre budget mensuel de <strong>{formatFCFA(-reste)}</strong>.</span>
                        </div>
                    )}

                    <div className="dashboard-panels">
                        <section className="workspace-panel dashboard-panel">
                            <div className="dashboard-panel-heading">
                                <div className="dashboard-panel-title">
                                    <span className="dashboard-panel-icon"><LuWallet aria-hidden="true" /></span>
                                    <div><h2>Budgets du mois</h2><p>{budgetsDuMois.length} enveloppe{budgetsDuMois.length > 1 ? "s" : ""} active{budgetsDuMois.length > 1 ? "s" : ""}</p></div>
                                </div>
                                <Link href="/mes-budgets" className="dashboard-link">Gérer <LuArrowRight aria-hidden="true" /></Link>
                            </div>

                            {budgetsDuMois.length === 0 ? (
                                <div className="dashboard-empty">
                                    <span className="dashboard-empty-icon"><LuWallet aria-hidden="true" /></span>
                                    <p>Aucun budget pour ce mois</p>
                                    <Link href="/mes-budgets"><LuPlus aria-hidden="true" /> Créer un budget</Link>
                                </div>
                            ) : (
                                <ul className="dashboard-budget-list">
                                    {budgetsDuMois.map((b, index) => {
                                        const dep = depenseDuBudget(b, transactionsDuMois)
                                        const p = pourcentage(dep, Number(b.montant))
                                        return (
                                            <li key={b.id} className="dashboard-budget-item">
                                                <div className="dashboard-budget-row">
                                                    <span className={`dashboard-budget-mark tone-${index % 4}`}>{(b.nomBudget || "B").charAt(0).toUpperCase()}</span>
                                                    <div className="dashboard-budget-info">
                                                        <div className="dashboard-budget-name"><strong>{b.nomBudget}</strong><span>{p}%</span></div>
                                                        <div className="dashboard-budget-track" role="progressbar" aria-label={`Budget ${b.nomBudget}`} aria-valuenow={Math.min(p, 100)} aria-valuemin={0} aria-valuemax={100}>
                                                            <span className={couleurProgression(p)} style={{ width: `${Math.min(p, 100)}%` }} />
                                                        </div>
                                                    </div>
                                                    <div className="dashboard-budget-amount"><strong>{formatFCFA(dep)}</strong><span>sur {formatFCFA(b.montant)}</span></div>
                                                </div>
                                            </li>
                                        )
                                    })}
                                </ul>
                            )}
                        </section>

                        <section className="workspace-panel dashboard-panel">
                            <div className="dashboard-panel-heading">
                                <div className="dashboard-panel-title">
                                    <span className="dashboard-panel-icon is-receipt"><LuReceipt aria-hidden="true" /></span>
                                    <div><h2>Dernières transactions</h2><p>Vos mouvements récents</p></div>
                                </div>
                                <Link href="/mes-transactions" className="dashboard-link">Tout voir <LuArrowRight aria-hidden="true" /></Link>
                            </div>

                            {transactionsDuMois.length === 0 ? (
                                <div className="dashboard-empty">
                                    <span className="dashboard-empty-icon is-receipt"><LuChartNoAxesCombined aria-hidden="true" /></span>
                                    <p>Aucune transaction ce mois-ci</p>
                                    <Link href="/mes-transactions"><LuPlus aria-hidden="true" /> Ajouter une dépense</Link>
                                </div>
                            ) : (
                                <ul className="dashboard-transaction-list">
                                    {transactionsDuMois.slice(0, 6).map((t) => (
                                        <li key={t.id} className="dashboard-transaction-item">
                                            <span className="dashboard-transaction-icon"><LuArrowDownRight aria-hidden="true" /></span>
                                            <div className="dashboard-transaction-info">
                                                <strong>{t.objectif}</strong>
                                                <span>{nomDuBudget(t.budgetId)} <i>·</i> {formatDateHeure(t.date)}</span>
                                            </div>
                                            <strong className="dashboard-transaction-amount">− {formatFCFA(t.montant)}</strong>
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
