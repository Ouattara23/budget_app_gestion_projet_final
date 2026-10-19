import type { Metadata } from "next"
import Link from "next/link"
import { Plus_Jakarta_Sans } from "next/font/google"
import type { ReactNode } from "react"
import type { IconType } from "react-icons"
import {
    LuArrowRight,
    LuBriefcase,
    LuCheck,
    LuChevronDown,
    LuFileSpreadsheet,
    LuGraduationCap,
    LuSearch,
    LuShieldCheck,
    LuSmartphone,
    LuTarget,
    LuTriangleAlert,
    LuUsers,
    LuWallet,
} from "react-icons/lu"
import AmiaChatbot from "@/components/AmiaChatbot"

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], display: "swap" })

export const metadata: Metadata = {
    title: "BudgetApp — Sachez où part votre argent",
    description:
        "Fixez un budget par poste, notez vos dépenses en quelques secondes et voyez d'un coup d'œil ce qu'il vous reste. En français, en FCFA, sans tableur.",
}

/* ---------- Données de la page ---------- */

const NAVY = "bg-[#142744]"

const reperes = [
    { icon: LuCheck, texte: "100 % en français" },
    { icon: LuWallet, texte: "Montants en FCFA" },
    { icon: LuShieldCheck, texte: "Connexion email ou Google" },
    { icon: LuSmartphone, texte: "Téléphone et ordinateur" },
]

const etapes = [
    { titre: "Créez votre compte", texte: "Email et mot de passe, ou un clic avec Google.", duree: "Moins d'une minute" },
    { titre: "Définissez vos budgets", texte: "Un montant par poste de dépense, pour le mois.", duree: "Quelques minutes, une fois par mois" },
    { titre: "Ajoutez vos dépenses", texte: "Une ligne par dépense, au moment où elle se produit.", duree: "Quelques secondes chacune" },
]

const publics: { icon: IconType; titre: string; texte: string }[] = [
    { icon: LuUsers, titre: "Particuliers et familles", texte: "Tenir le cap sur le mois, sans mauvaise surprise à la fin." },
    { icon: LuGraduationCap, titre: "Étudiants et jeunes actifs", texte: "Apprendre à gérer un premier revenu avec des repères simples." },
    { icon: LuBriefcase, titre: "Indépendants et petits entrepreneurs", texte: "Séparer vie courante, projets et imprévus en enveloppes distinctes." },
    { icon: LuTarget, titre: "Ceux qui préparent un projet", texte: "Mariage, rentrée scolaire, déménagement : voir l'argent qui y est consacré." },
]

const questions = [
    { q: "Est-ce vraiment gratuit ?", r: "Oui. Aujourd'hui, vous pouvez vous inscrire et utiliser BudgetApp sans rien payer." },
    { q: "Ai-je besoin d'un compte bancaire ?", r: "Non. Vous notez vous-même vos dépenses : BudgetApp n'est relié à aucune banque." },
    { q: "Mes budgets sont-ils privés ?", r: "Oui, chacun ne voit que ses propres budgets. La connexion repose sur Firebase, le service d'authentification de Google : les mots de passe ne sont jamais stockés en clair." },
    { q: "Que se passe-t-il si je dépasse un budget ?", r: "L'application vous prévient, sans jamais vous bloquer. C'est vous qui décidez." },
    { q: "Dois-je installer quelque chose ?", r: "Non. BudgetApp s'ouvre dans le navigateur, sur ordinateur comme sur téléphone." },
]

const budgetsApercu = [
    { nom: "Loyer", depense: 50000, total: 100000 },
    { nom: "Alimentation", depense: 62300, total: 80000 },
    { nom: "Transport", depense: 18200, total: 40000 },
    { nom: "Loisirs", depense: 34000, total: 30000 },
]

/* ---------- Petits utilitaires ---------- */

const fcfa = (n: number) => n.toLocaleString("fr-FR")

function Logo({ clair = false }: { clair?: boolean }) {
    return (
        <Link href="/" aria-label="BudgetApp, accueil" className={`flex items-center gap-2.5 text-lg font-extrabold tracking-tight ${clair ? "text-white" : "text-[#142744]"}`}>
            <span className="flex size-9 items-center justify-center rounded-xl bg-blue-600 text-white">
                <LuWallet className="size-5" />
            </span>
            <span>
                budget<span className={clair ? "text-blue-300" : "text-blue-600"}>App</span>
            </span>
        </Link>
    )
}

function Eyebrow({ children }: { children: ReactNode }) {
    return <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">{children}</p>
}

/* ---------- Aperçu du produit (reprend le tableau de bord réel) ---------- */

function ProductPreview() {
    return (
        <div className="relative mx-auto w-full max-w-[540px]">
            <div className={`${NAVY} relative overflow-hidden rounded-[1.75rem] p-5 text-white shadow-[0_40px_80px_-30px_rgba(20,39,68,0.55)] ring-1 ring-white/10 sm:p-7`}>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.17em] text-blue-200/80">Vue d&apos;ensemble</p>
                        <p className="mt-1.5 text-lg font-bold tracking-tight">Tableau de bord</p>
                    </div>
                    <span className="rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-blue-100 ring-1 ring-white/10">Ce mois-ci</span>
                </div>

                <div className="mt-7 flex items-center justify-between gap-6">
                    <div className="min-w-0">
                        <p className="text-xs font-medium text-blue-100/70">Reste disponible</p>
                        <p className="mt-1.5 text-3xl font-extrabold tracking-tight sm:text-4xl">
                            85 500 <span className="text-base font-semibold text-blue-100/70">FCFA</span>
                        </p>
                        <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-amber-400/10 px-3 py-1.5 text-[11px] font-semibold text-amber-200 ring-1 ring-amber-300/20">
                            <span className="size-1.5 rounded-full bg-amber-300" /> 1 budget à surveiller
                        </span>
                    </div>
                    <div
                        className="grid size-28 shrink-0 place-items-center rounded-full sm:size-32"
                        style={{ background: "conic-gradient(#60a5fa 0 66%, rgba(255,255,255,0.12) 0)" }}
                        role="img"
                        aria-label="66 % du budget utilisé"
                    >
                        <div className="grid size-[5.5rem] place-items-center rounded-full bg-[#19365e] sm:size-[6.25rem]">
                            <div className="text-center">
                                <p className="text-xl font-extrabold leading-none sm:text-2xl">66 %</p>
                                <p className="mt-1 text-[10px] text-blue-100/70">utilisé</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/10 text-sm">
                    <div className="bg-[#17325a] px-4 py-3">
                        <p className="text-[11px] text-blue-100/70">Budget alloué</p>
                        <p className="mt-0.5 font-bold">250 000 FCFA</p>
                    </div>
                    <div className="bg-[#17325a] px-4 py-3">
                        <p className="text-[11px] text-blue-100/70">Déjà dépensé</p>
                        <p className="mt-0.5 font-bold">164 500 FCFA</p>
                    </div>
                </div>
            </div>

            <div className="relative -mt-6 ml-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_24px_60px_-30px_rgba(20,39,68,0.35)] sm:ml-10 sm:p-6">
                <p className="text-sm font-bold text-slate-900">Vos budgets du mois</p>
                <ul className="mt-4 space-y-4">
                    {budgetsApercu.map((b) => {
                        const pct = Math.round((b.depense / b.total) * 100)
                        const couleur = pct > 100 ? "bg-rose-500" : pct >= 75 ? "bg-amber-400" : "bg-emerald-500"
                        return (
                            <li key={b.nom}>
                                <div className="flex items-baseline justify-between gap-3 text-xs">
                                    <span className="font-semibold text-slate-800">{b.nom}</span>
                                    <span className="text-slate-500">
                                        {fcfa(b.depense)} / {fcfa(b.total)} FCFA
                                    </span>
                                </div>
                                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                                    <div className={`h-full rounded-full ${couleur}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </div>

            <div className="absolute -right-2 -top-5 hidden max-w-[260px] items-start gap-3 rounded-2xl border border-amber-200 bg-white p-4 shadow-xl shadow-slate-900/10 sm:flex lg:-right-8">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                    <LuTriangleAlert className="size-4" />
                </span>
                <div>
                    <p className="text-xs font-bold text-slate-900">Petit point d&apos;attention</p>
                    <p className="mt-1 text-[11px] leading-5 text-slate-600">Cette dépense de 20 000 FCFA dépasse ce qu&apos;il reste dans Alimentation (17 700 FCFA).</p>
                </div>
            </div>
        </div>
    )
}

/* ---------- Page ---------- */

export default function Home() {
    return (
        <>
            <main className={`${jakarta.className} min-h-screen bg-[#f7f9fc] text-slate-900`}>
                {/* En-tête */}
                <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur-md">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
                        <Logo />
                        <nav className="hidden items-center gap-9 md:flex" aria-label="Navigation principale">
                            <a href="#fonctionnalites" className="text-sm font-medium text-slate-600 transition hover:text-blue-700">Fonctionnalités</a>
                            <a href="#comment-ca-marche" className="text-sm font-medium text-slate-600 transition hover:text-blue-700">Comment ça marche</a>
                            <a href="#faq" className="text-sm font-medium text-slate-600 transition hover:text-blue-700">Questions</a>
                        </nav>
                        <div className="flex items-center gap-2">
                            <Link href="/connexion" className="hidden rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:inline-flex">Connexion</Link>
                            <Link href="/inscription" className="inline-flex items-center gap-2 rounded-full bg-[#142744] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
                                Commencer <LuArrowRight className="size-4" />
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Hero */}
                <section className="relative overflow-hidden">
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(ellipse_at_70%_0%,rgba(37,99,235,0.10),transparent_60%)]" aria-hidden="true" />
                    <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-5 pb-24 pt-14 sm:px-8 sm:pt-20 lg:grid-cols-[1fr_1fr] lg:gap-12 lg:px-10 lg:pb-32 lg:pt-24">
                        <div className="max-w-xl">
                            <Eyebrow>Application de budget · en FCFA</Eyebrow>
                            <h1 className="mt-5 text-[2.6rem] font-extrabold leading-[1.06] tracking-[-0.045em] text-[#0f1d36] sm:text-6xl lg:text-[3.6rem]">
                                Sachez où part votre argent, et <span className="text-blue-600">ce qu&apos;il vous reste.</span>
                            </h1>
                            <p className="mt-6 text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                                Fixez un budget par poste, notez vos dépenses en quelques secondes et lisez votre mois d&apos;un coup d&apos;œil. Sans tableur, sans jargon.
                            </p>
                            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                                <Link href="/inscription" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-blue-600 px-7 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700">
                                    Créer mon compte gratuitement <LuArrowRight className="size-4" />
                                </Link>
                                <a href="#comment-ca-marche" className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-300 bg-white px-7 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50">
                                    Voir comment ça marche
                                </a>
                            </div>
                            <p className="mt-5 text-xs text-slate-500">Gratuit pour démarrer · Inscription en moins d&apos;une minute</p>
                        </div>
                        <ProductPreview />
                    </div>
                </section>

                {/* Repères */}
                <section aria-label="En bref" className="border-y border-slate-200 bg-white">
                    <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-y-5 px-5 py-6 sm:px-8 lg:grid-cols-4 lg:px-10">
                        {reperes.map(({ icon: Icon, texte }) => (
                            <li key={texte} className="flex items-center justify-center gap-2.5 text-sm font-semibold text-slate-700">
                                <Icon className="size-4 text-blue-600" /> {texte}
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Fonctionnalités */}
                <section id="fonctionnalites" className="scroll-mt-20 px-5 py-24 sm:px-8 lg:px-10 lg:py-28">
                    <div className="mx-auto max-w-7xl">
                        <div className="max-w-2xl">
                            <Eyebrow>Ce que vous pouvez faire</Eyebrow>
                            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#0f1d36] sm:text-4xl">Tout ce qu&apos;il faut pour tenir votre mois, rien de plus.</h2>
                            <p className="mt-4 text-base leading-7 text-slate-600">Des couleurs et des pourcentages plutôt que des colonnes de chiffres.</p>
                        </div>

                        <div className="mt-14 grid gap-5 md:grid-cols-6">
                            {/* Signal de couleur */}
                            <article className="rounded-3xl border border-slate-200 bg-white p-7 sm:p-9 md:col-span-4">
                                <h3 className="text-xl font-bold tracking-tight text-[#0f1d36]">Un signal de couleur, en un coup d&apos;œil</h3>
                                <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">Chaque budget affiche ce qui est dépensé, ce qu&apos;il reste et le pourcentage consommé.</p>
                                <ul className="mt-8 space-y-5">
                                    {[
                                        { etat: "Tout va bien", detail: "Moins de 75 % utilisé", pct: 42, barre: "bg-emerald-500" },
                                        { etat: "Vous approchez de la limite", detail: "Entre 75 % et 100 %", pct: 88, barre: "bg-amber-400" },
                                        { etat: "Budget dépassé", detail: "Le montant du dépassement est affiché", pct: 100, barre: "bg-rose-500" },
                                    ].map((l) => (
                                        <li key={l.etat}>
                                            <div className="flex flex-wrap items-baseline justify-between gap-x-4 text-sm">
                                                <span className="font-semibold text-slate-800">{l.etat}</span>
                                                <span className="text-xs text-slate-500">{l.detail}</span>
                                            </div>
                                            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                                                <div className={`h-full rounded-full ${l.barre}`} style={{ width: `${l.pct}%` }} />
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </article>

                            {/* Avertissement doux */}
                            <article className="rounded-3xl border border-slate-200 bg-white p-7 sm:p-9 md:col-span-2">
                                <span className="flex size-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700"><LuTriangleAlert className="size-5" /></span>
                                <h3 className="mt-6 text-xl font-bold tracking-tight text-[#0f1d36]">On vous prévient, on ne vous bloque jamais</h3>
                                <p className="mt-2 text-sm leading-6 text-slate-600">Une dépense dépasse ce qu&apos;il reste dans le budget choisi ? Un avertissement apparaît. Vous gardez la main.</p>
                            </article>

                            {/* Recherche */}
                            <article className="rounded-3xl border border-slate-200 bg-white p-7 sm:p-9 md:col-span-2">
                                <span className="flex size-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-700"><LuSearch className="size-5" /></span>
                                <h3 className="mt-6 text-xl font-bold tracking-tight text-[#0f1d36]">Retrouvez chaque dépense</h3>
                                <p className="mt-2 text-sm leading-6 text-slate-600">Recherche par mot-clé, filtres par période et par budget. Le total se met à jour selon vos filtres.</p>
                            </article>

                            {/* Export */}
                            <article className="rounded-3xl border border-slate-200 bg-white p-7 sm:p-9 md:col-span-2">
                                <span className="flex size-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700"><LuFileSpreadsheet className="size-5" /></span>
                                <h3 className="mt-6 text-xl font-bold tracking-tight text-[#0f1d36]">Export compatible Excel</h3>
                                <p className="mt-2 text-sm leading-6 text-slate-600">Un clic pour obtenir un fichier au format français, pratique pour partager ou archiver.</p>
                            </article>

                            {/* Mobile */}
                            <article className="rounded-3xl border border-slate-200 bg-white p-7 sm:p-9 md:col-span-2">
                                <span className="flex size-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700"><LuSmartphone className="size-5" /></span>
                                <h3 className="mt-6 text-xl font-bold tracking-tight text-[#0f1d36]">Aussi à l&apos;aise sur téléphone</h3>
                                <p className="mt-2 text-sm leading-6 text-slate-600">Rien à installer : l&apos;application s&apos;ouvre dans le navigateur et s&apos;adapte à tous les écrans.</p>
                            </article>
                        </div>
                    </div>
                </section>

                {/* Comment ça marche */}
                <section id="comment-ca-marche" className="scroll-mt-20 border-y border-slate-200 bg-white px-5 py-24 sm:px-8 lg:px-10 lg:py-28">
                    <div className="mx-auto grid max-w-7xl items-start gap-14 lg:grid-cols-2 lg:gap-20">
                        <div>
                            <Eyebrow>Simple dès le départ</Eyebrow>
                            <h2 className="mt-4 max-w-lg text-3xl font-extrabold tracking-tight text-[#0f1d36] sm:text-4xl">Trois gestes, et vous savez où en est votre mois.</h2>
                            <ol className="mt-10 space-y-8">
                                {etapes.map((e, i) => (
                                    <li key={e.titre} className="flex gap-5">
                                        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#142744] text-sm font-bold text-white">{i + 1}</span>
                                        <div>
                                            <h3 className="font-bold text-[#0f1d36]">{e.titre}</h3>
                                            <p className="mt-1 text-sm leading-6 text-slate-600">{e.texte}</p>
                                            <p className="mt-2 text-xs font-semibold text-blue-700">{e.duree}</p>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </div>

                        <aside className={`${NAVY} rounded-3xl p-7 text-white sm:p-10`}>
                            <p className="text-[10px] font-extrabold uppercase tracking-[0.17em] text-blue-200/80">Exemple illustratif</p>
                            <h3 className="mt-3 text-2xl font-extrabold tracking-tight">Un mois avec Awa, 29 ans, à son compte</h3>
                            <p className="mt-3 text-sm leading-6 text-blue-100/80">En début de mois, elle crée trois budgets :</p>
                            <ul className="mt-5 divide-y divide-white/10 rounded-2xl bg-white/5 text-sm ring-1 ring-white/10">
                                {[
                                    ["Alimentation", "80 000"],
                                    ["Transport", "40 000"],
                                    ["Loisirs", "30 000"],
                                ].map(([nom, montant]) => (
                                    <li key={nom} className="flex items-center justify-between px-5 py-3.5">
                                        <span className="font-semibold">{nom}</span>
                                        <span className="text-blue-100/80">{montant} FCFA</span>
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-6 text-sm leading-7 text-blue-100/85">
                                Un après-midi, en ajoutant 12 500 FCFA de courses au marché, l&apos;application la prévient que ce montant dépasse ce qu&apos;il reste dans son budget Alimentation. Elle ajuste ses achats de la semaine et termine le mois sans mauvaise surprise.
                            </p>
                        </aside>
                    </div>
                </section>

                {/* Pour qui */}
                <section className="px-5 py-24 sm:px-8 lg:px-10 lg:py-28">
                    <div className="mx-auto max-w-7xl">
                        <div className="max-w-2xl">
                            <Eyebrow>Pour qui ?</Eyebrow>
                            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#0f1d36] sm:text-4xl">Reprendre la main sur son argent, sans devenir comptable.</h2>
                            <p className="mt-4 text-base leading-7 text-slate-600">Pensé pour le quotidien en Afrique francophone : monnaie en FCFA, interface en français, dates à la française.</p>
                        </div>
                        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {publics.map(({ icon: Icon, titre, texte }) => (
                                <article key={titre} className="rounded-3xl border border-slate-200 bg-white p-6">
                                    <span className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Icon className="size-5" /></span>
                                    <h3 className="mt-5 font-bold leading-snug text-[#0f1d36]">{titre}</h3>
                                    <p className="mt-2 text-sm leading-6 text-slate-600">{texte}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section id="faq" className="scroll-mt-20 border-t border-slate-200 bg-white px-5 py-24 sm:px-8 lg:px-10 lg:py-28">
                    <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
                        <div>
                            <Eyebrow>Questions fréquentes</Eyebrow>
                            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#0f1d36] sm:text-4xl">Avant de vous lancer</h2>
                            <p className="mt-4 text-base leading-7 text-slate-600">Une autre question ? Amia, l&apos;assistant en bas à droite, peut vous répondre.</p>
                        </div>
                        <div className="divide-y divide-slate-200 border-y border-slate-200">
                            {questions.map((item) => (
                                <details key={item.q} className="group py-5">
                                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-bold text-[#0f1d36] [&::-webkit-details-marker]:hidden">
                                        {item.q}
                                        <LuChevronDown className="size-5 shrink-0 text-slate-400 transition group-open:rotate-180" />
                                    </summary>
                                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">{item.r}</p>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Appel final */}
                <section className="px-5 py-20 sm:px-8 lg:px-10">
                    <div className={`${NAVY} mx-auto max-w-7xl rounded-[2rem] px-7 py-14 text-center text-white sm:px-12 sm:py-20`}>
                        <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">Votre budget, plus clair. Vos projets, plus proches.</h2>
                        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-blue-100/80">Créez votre compte, ajoutez votre premier budget, notez votre première dépense.</p>
                        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                            <Link href="/inscription" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-bold text-[#142744] transition hover:bg-blue-50">
                                Créer mon compte gratuitement <LuArrowRight className="size-4" />
                            </Link>
                            <Link href="/connexion" className="inline-flex min-h-12 items-center justify-center rounded-full px-7 text-sm font-semibold text-white ring-1 ring-white/25 transition hover:bg-white/10">
                                J&apos;ai déjà un compte
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Pied de page */}
                <footer className="border-t border-slate-200 bg-white px-5 py-10 sm:px-8 lg:px-10">
                    <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
                        <div>
                            <Logo />
                            <p className="mt-3 text-xs text-slate-500">Une vision plus claire de votre budget.</p>
                        </div>
                        <nav aria-label="Pied de page" className="flex flex-wrap gap-x-7 gap-y-3 text-sm font-medium text-slate-600">
                            <a href="#fonctionnalites" className="transition hover:text-blue-700">Fonctionnalités</a>
                            <a href="#comment-ca-marche" className="transition hover:text-blue-700">Comment ça marche</a>
                            <a href="#faq" className="transition hover:text-blue-700">Questions</a>
                            <Link href="/connexion" className="transition hover:text-blue-700">Connexion</Link>
                            <Link href="/inscription" className="transition hover:text-blue-700">Inscription</Link>
                        </nav>
                    </div>
                    <p className="mx-auto mt-8 max-w-7xl text-xs text-slate-400">© {new Date().getFullYear()} BudgetApp</p>
                </footer>
            </main>
            <AmiaChatbot />
        </>
    )
}
