/*
 * Maquettes de la page d'accueil.
 * Ce sont de simples illustrations en HTML/CSS (aucune donnée réelle) qui reprennent
 * l'interface de l'application : même palette, même logique vert / orange / rouge.
 * Les chiffres sont cohérents d'une maquette à l'autre :
 *   budgets : Loyer 50 000 / 100 000 · Alimentation 62 300 / 80 000 · Transport 18 200 / 40 000 · Loisirs 34 000 / 30 000
 *   total alloué 250 000 · dépensé 164 500 · reste 85 500 · 66 % utilisé
 */
import {
    LuDownload,
    LuFileSpreadsheet,
    LuLayoutDashboard,
    LuReceipt,
    LuSearch,
    LuTriangleAlert,
    LuWallet,
} from "react-icons/lu"

export const fcfa = (n: number) => n.toLocaleString("fr-FR")

type Budget = { nom: string; depense: number; total: number }

const budgetsApercu: Budget[] = [
    { nom: "Loyer", depense: 50000, total: 100000 },
    { nom: "Alimentation", depense: 62300, total: 80000 },
    { nom: "Transport", depense: 18200, total: 40000 },
    { nom: "Loisirs", depense: 34000, total: 30000 },
]

/* Mêmes seuils que dans l'application : vert < 75 %, orange de 75 à 100 %, rouge au-delà */
function etat(pct: number) {
    if (pct > 100) return { barre: "bg-rose-500", texte: "text-rose-700" }
    if (pct >= 75) return { barre: "bg-amber-400", texte: "text-amber-700" }
    return { barre: "bg-emerald-500", texte: "text-emerald-700" }
}

function BudgetLigne({ b }: { b: Budget }) {
    const pct = Math.round((b.depense / b.total) * 100)
    const e = etat(pct)
    return (
        <li>
            <div className="flex items-baseline justify-between gap-3">
                <span className="text-xs font-semibold text-slate-800">{b.nom}</span>
                <span className={`text-[11px] font-bold tabular-nums ${e.texte}`}>{pct} %</span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div className={`h-full rounded-full ${e.barre}`} style={{ width: `${Math.min(pct, 100)}%` }} />
            </div>
            <p className="mt-1 text-[11px] tabular-nums text-slate-500">
                {fcfa(b.depense)} / {fcfa(b.total)} FCFA
            </p>
        </li>
    )
}

/* ---------- Hero : fenêtre « ordinateur » + téléphone ---------- */

const navLateral = [
    { libelle: "Tableau de bord", actif: true, icon: LuLayoutDashboard },
    { libelle: "Mes budgets", actif: false, icon: LuWallet },
    { libelle: "Mes transactions", actif: false, icon: LuReceipt },
]

function FenetreOrdinateur() {
    return (
        <div className="overflow-hidden rounded-2xl bg-[#f4f7fb] shadow-[0_50px_100px_-30px_rgba(2,8,23,0.75)] ring-1 ring-white/20">
            {/* Barre de fenêtre */}
            <div className="flex items-center gap-1.5 border-b border-slate-200 bg-white px-4 py-3">
                <span className="size-2.5 rounded-full bg-slate-200" />
                <span className="size-2.5 rounded-full bg-slate-200" />
                <span className="size-2.5 rounded-full bg-slate-200" />
            </div>

            <div className="grid sm:grid-cols-[150px_1fr]">
                {/* Menu latéral, comme dans l'application */}
                <div className="hidden flex-col gap-1 bg-[#142744] p-3 sm:flex">
                    <div className="mb-3 flex items-center gap-2 px-1.5 pt-1 text-[13px] font-extrabold tracking-tight text-white">
                        <span className="flex size-6 items-center justify-center rounded-lg bg-blue-600">
                            <LuWallet className="size-3.5" />
                        </span>
                        budget<span className="-ml-1.5 text-blue-300">App</span>
                    </div>
                    {navLateral.map(({ libelle, actif, icon: Icon }) => (
                        <div
                            key={libelle}
                            className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-[11px] font-semibold ${actif ? "bg-blue-600 text-white" : "text-blue-200/70"}`}
                        >
                            <Icon className="size-3.5" /> {libelle}
                        </div>
                    ))}
                </div>

                {/* Contenu : tableau de bord */}
                <div className="min-w-0 p-4 sm:p-5">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-slate-400">Vue d&apos;ensemble</p>
                            <p className="mt-0.5 text-sm font-bold tracking-tight text-[#182b49]">Tableau de bord</p>
                        </div>
                        <span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-semibold text-slate-600 ring-1 ring-slate-200">Ce mois-ci</span>
                    </div>

                    <div className="mt-4 rounded-2xl bg-[linear-gradient(120deg,#142b4d,#1b3964_58%,#234878)] p-4 text-white sm:p-5">
                        <div className="flex items-center justify-between gap-4">
                            <div className="min-w-0">
                                <p className="text-[11px] text-blue-100/70">Reste disponible</p>
                                <p className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
                                    85 500 <span className="text-sm font-semibold text-blue-100/70">FCFA</span>
                                </p>
                                <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-400/15 px-2.5 py-1 text-[10px] font-semibold text-amber-200 ring-1 ring-amber-300/25">
                                    <span className="size-1.5 rounded-full bg-amber-300" /> 2 budgets à surveiller
                                </span>
                            </div>
                            <div className="grid size-24 shrink-0 place-items-center rounded-full" style={{ background: "conic-gradient(#60a5fa 0 66%, rgba(255,255,255,0.14) 0)" }}>
                                <div className="grid size-[4.5rem] place-items-center rounded-full bg-[#1a3760]">
                                    <div className="text-center">
                                        <p className="text-lg font-extrabold leading-none">66 %</p>
                                        <p className="mt-0.5 text-[9px] text-blue-100/70">utilisé</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-white/10 text-[11px]">
                            <div className="bg-[#1a3760] px-3 py-2">
                                <p className="text-blue-100/70">Budget alloué</p>
                                <p className="mt-0.5 font-bold">250 000 FCFA</p>
                            </div>
                            <div className="bg-[#1a3760] px-3 py-2">
                                <p className="text-blue-100/70">Déjà dépensé</p>
                                <p className="mt-0.5 font-bold">164 500 FCFA</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 rounded-2xl bg-white p-4 ring-1 ring-slate-200/80">
                        <p className="text-xs font-bold text-slate-900">Vos budgets du mois</p>
                        <ul className="mt-3 grid gap-x-6 gap-y-4 sm:grid-cols-2">
                            {budgetsApercu.map((b) => (
                                <BudgetLigne key={b.nom} b={b} />
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Telephone() {
    return (
        <div className="w-[176px] rounded-[2rem] bg-[#0b1426] p-[5px] shadow-[0_30px_60px_-15px_rgba(2,8,23,0.8)] ring-1 ring-white/25 sm:w-[196px]">
            <div className="overflow-hidden rounded-[1.65rem] bg-white">
                <div className="mx-auto mt-2 h-4 w-16 rounded-full bg-[#0b1426]" />
                <div className="px-3.5 pb-4 pt-3">
                    <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-blue-700">Nouvelle dépense</p>

                    <p className="mt-3 text-[10px] font-medium text-slate-500">Objectif</p>
                    <div className="mt-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-[11px] font-semibold text-slate-800">Courses du marché</div>

                    <p className="mt-2.5 text-[10px] font-medium text-slate-500">Budget</p>
                    <div className="mt-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-[11px] font-semibold text-slate-800">Alimentation</div>

                    <p className="mt-2.5 text-[10px] font-medium text-slate-500">Montant</p>
                    <div className="mt-1 flex items-center justify-between rounded-lg border border-amber-300 bg-white px-2.5 py-2 text-[11px] font-bold text-slate-900 ring-2 ring-amber-100">
                        <span>20 000</span>
                        <span className="text-[10px] font-semibold text-slate-400">FCFA</span>
                    </div>

                    <p className="mt-2.5 flex gap-1.5 rounded-lg bg-amber-50 p-2 text-[10px] leading-[1.35] text-amber-900 ring-1 ring-amber-200">
                        <LuTriangleAlert className="mt-px size-3 shrink-0 text-amber-600" />
                        Dépasse ce qu&apos;il reste dans Alimentation (17 700 FCFA).
                    </p>

                    <div className="mt-3 rounded-lg bg-[#142744] py-2 text-center text-[11px] font-bold text-white">Ajouter</div>
                </div>
            </div>
        </div>
    )
}

function BulleAttention() {
    return (
        <div className="flex max-w-[250px] items-start gap-3 rounded-2xl border border-amber-200 bg-white p-4 shadow-xl shadow-slate-950/20">
            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <LuTriangleAlert className="size-4" />
            </span>
            <div>
                <p className="text-xs font-bold text-slate-900">Petit point d&apos;attention</p>
                <p className="mt-1 text-[11px] leading-5 text-slate-600">On vous prévient, on ne vous bloque jamais : c&apos;est vous qui décidez.</p>
            </div>
        </div>
    )
}

export function HeroMock() {
    return (
        <div className="relative mx-auto w-full max-w-[620px] pb-0 sm:pb-16 lg:mx-0">
            <p className="sr-only">
                Aperçu de l&apos;application : un tableau de bord qui affiche le reste disponible du mois et la progression de chaque budget, et un écran de saisie
                de dépense sur téléphone qui prévient quand un budget est dépassé.
            </p>
            <div aria-hidden="true">
                <div className="landing-rise">
                    <FenetreOrdinateur />
                </div>

                <div className="landing-rise landing-delay-2 absolute bottom-0 right-3 hidden sm:block">
                    <div className="landing-float">
                        <Telephone />
                    </div>
                </div>

                <div className="landing-rise landing-delay-3 absolute bottom-6 left-4 hidden sm:block">
                    <div className="landing-float landing-float-slow">
                        <BulleAttention />
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ---------- Mini-interfaces des fonctionnalités ---------- */

const signaux = [
    {
        nom: "Transport",
        pct: 46,
        etat: "Tout va bien",
        reste: "Il reste 21 800 FCFA",
        barre: "bg-emerald-500",
        pastille: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    },
    {
        nom: "Alimentation",
        pct: 78,
        etat: "Vous approchez de la limite",
        reste: "Il reste 17 700 FCFA",
        barre: "bg-amber-400",
        pastille: "bg-amber-50 text-amber-800 ring-amber-200",
    },
    {
        nom: "Loisirs",
        pct: 113,
        etat: "Budget dépassé",
        reste: "Dépassé de 4 000 FCFA",
        barre: "bg-rose-500",
        pastille: "bg-rose-50 text-rose-700 ring-rose-200",
    },
]

export function SignalCouleurMock() {
    return (
        <div aria-hidden="true" className="grid gap-3 sm:grid-cols-3">
            {signaux.map((s) => (
                <div key={s.nom} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                    <div className="flex items-baseline justify-between gap-2">
                        <span className="text-sm font-bold text-slate-900">{s.nom}</span>
                        <span className="text-xs font-bold tabular-nums text-slate-600">{s.pct} %</span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200/80">
                        <div className={`h-full rounded-full ${s.barre}`} style={{ width: `${Math.min(s.pct, 100)}%` }} />
                    </div>
                    <p className="mt-3 text-xs font-medium tabular-nums text-slate-600">{s.reste}</p>
                    <span className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ring-1 ${s.pastille}`}>{s.etat}</span>
                </div>
            ))}
        </div>
    )
}

export function AvertissementMock() {
    return (
        <div aria-hidden="true" className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <p className="text-[11px] font-semibold text-slate-500">Montant</p>
            <div className="mt-1.5 flex items-center justify-between rounded-xl border border-amber-300 bg-white px-3.5 py-2.5 text-sm font-bold text-slate-900 ring-4 ring-amber-100">
                <span>20 000</span>
                <span className="text-xs font-semibold text-slate-400">FCFA</span>
            </div>
            <p className="mt-3 flex gap-2 text-xs leading-5 text-amber-900">
                <LuTriangleAlert className="mt-0.5 size-4 shrink-0 text-amber-600" />
                Cette dépense dépasse ce qu&apos;il reste dans Alimentation (17 700 FCFA).
            </p>
            <div className="mt-3 rounded-xl bg-[#142744] py-2.5 text-center text-xs font-bold text-white">Ajouter</div>
        </div>
    )
}

export function RechercheMock() {
    return (
        <div aria-hidden="true" className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 text-xs font-medium text-slate-700 ring-1 ring-slate-200">
                <LuSearch className="size-3.5 text-slate-400" /> marché
            </div>
            <div className="mt-2.5 flex flex-wrap gap-1.5 text-[11px] font-semibold">
                <span className="rounded-full bg-blue-600 px-3 py-1 text-white">Ce mois-ci</span>
                <span className="rounded-full bg-blue-600 px-3 py-1 text-white">Alimentation</span>
            </div>
            <ul className="mt-3 divide-y divide-slate-200 rounded-xl bg-white text-xs ring-1 ring-slate-200">
                <li className="flex items-center justify-between px-3.5 py-2.5">
                    <span className="font-semibold text-slate-800">Courses du marché</span>
                    <span className="tabular-nums text-slate-600">12 500 FCFA</span>
                </li>
                <li className="flex items-center justify-between px-3.5 py-2.5">
                    <span className="font-semibold text-slate-800">Légumes du marché</span>
                    <span className="tabular-nums text-slate-600">4 800 FCFA</span>
                </li>
            </ul>
            <div className="mt-3 flex items-center justify-between rounded-xl bg-[#142744] px-3.5 py-2.5 text-xs text-white">
                <span className="text-blue-100/80">Total affiché</span>
                <b className="tabular-nums">17 300 FCFA</b>
            </div>
        </div>
    )
}

export function ExportMock() {
    return (
        <div aria-hidden="true" className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <div className="flex items-center gap-3 rounded-xl bg-white p-3.5 ring-1 ring-slate-200">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <LuFileSpreadsheet className="size-5" />
                </span>
                <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900">Mes dépenses</p>
                    <p className="text-[11px] text-slate-500">Compatible Excel · format français</p>
                </div>
            </div>
            <div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[#142744] px-4 py-2.5 text-xs font-bold text-white">
                <LuDownload className="size-4" /> Exporter
            </div>
        </div>
    )
}
