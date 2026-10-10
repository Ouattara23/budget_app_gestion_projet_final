import type { Metadata } from "next"
import Link from "next/link"
import AmiaChatbot from "@/components/AmiaChatbot"
import { LuArrowDownRight, LuArrowRight, LuChartNoAxesCombined, LuCheck, LuCircleHelp, LuCreditCard, LuShieldCheck, LuSparkles, LuWallet } from "react-icons/lu"

export const metadata: Metadata = {
    title: "BudgetApp — Gérez votre budget simplement",
    description: "Planifiez vos budgets, suivez vos dépenses et gardez une vue claire sur votre argent avec BudgetApp.",
}

const avantages = [
    { icon: LuWallet, titre: "Des budgets à votre image", texte: "Créez un budget par projet ou par poste de dépense et fixez vos limites pour le mois." },
    { icon: LuCreditCard, titre: "Vos dépenses en un coup d’œil", texte: "Enregistrez chaque transaction et retrouvez facilement son montant, sa date et son budget." },
    { icon: LuChartNoAxesCombined, titre: "Une vue claire sur le mois", texte: "Comparez le montant alloué à vos dépenses et voyez ce qu’il vous reste." },
]

function Logo() {
    return <Link href="/" className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight text-slate-950" aria-label="BudgetApp, accueil"><span className="flex size-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20"><LuWallet className="size-5" /></span><span>budget<span className="text-blue-600">App</span></span></Link>
}

function DashboardPreview() {
    return (
        <div className="relative mx-auto w-full max-w-[560px]">
            <div className="absolute -inset-7 rounded-[2.5rem] bg-blue-300/20 blur-3xl" aria-hidden="true" />
            <div className="relative rotate-1 rounded-[1.75rem] border border-white/70 bg-white p-4 shadow-[0_35px_90px_-35px_rgba(15,23,42,0.42)] sm:p-6">
                <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><LuWallet className="size-5" /></span><div><p className="text-sm font-bold text-slate-900">Mon tableau de bord</p><p className="text-xs text-slate-500">Vue d’ensemble · Juin 2025</p></div></div>
                    <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">Ce mois-ci</span>
                </div>
                <div className="grid grid-cols-2 gap-3 py-5 sm:grid-cols-3">
                    <div className="rounded-2xl bg-slate-50 p-3.5 sm:p-4"><p className="text-[11px] font-medium text-slate-500 sm:text-xs">Budget alloué</p><p className="mt-2 text-base font-extrabold text-slate-900 sm:text-lg">250 000 <span className="text-xs font-semibold text-slate-500">FCFA</span></p></div>
                    <div className="rounded-2xl bg-blue-50/80 p-3.5 sm:p-4"><p className="text-[11px] font-medium text-slate-500 sm:text-xs">Déjà dépensé</p><p className="mt-2 text-base font-extrabold text-blue-700 sm:text-lg">164 500 <span className="text-xs font-semibold text-blue-700/70">FCFA</span></p></div>
                    <div className="col-span-2 rounded-2xl bg-green-50 p-3.5 sm:col-span-1 sm:p-4"><p className="text-[11px] font-medium text-slate-500 sm:text-xs">Reste disponible</p><p className="mt-2 text-base font-extrabold text-green-700 sm:text-lg">85 500 <span className="text-xs font-semibold text-green-700/70">FCFA</span></p></div>
                </div>
                <div className="rounded-2xl border border-slate-100 p-4 sm:p-5">
                    <div className="mb-4 flex items-center justify-between"><div><p className="text-sm font-bold text-slate-800">Dépenses du mois</p><p className="mt-1 text-xs text-slate-500">Suivez votre rythme en un regard</p></div><span className="flex size-9 items-center justify-center rounded-xl bg-slate-50 text-slate-500"><LuArrowDownRight className="size-4" /></span></div>
                    <div className="flex h-28 items-end gap-2 sm:h-32 sm:gap-3" aria-label="Exemple de graphique des dépenses"><div className="h-[38%] flex-1 rounded-t-md bg-blue-100" /><div className="h-[56%] flex-1 rounded-t-md bg-blue-200" /><div className="h-[46%] flex-1 rounded-t-md bg-blue-300" /><div className="h-[76%] flex-1 rounded-t-md bg-blue-400" /><div className="h-[62%] flex-1 rounded-t-md bg-blue-500" /><div className="h-[88%] flex-1 rounded-t-md bg-blue-600" /><div className="h-[68%] flex-1 rounded-t-md bg-blue-300" /></div>
                    <div className="mt-2 flex justify-between text-[10px] font-medium text-slate-400"><span>Sem. 1</span><span>Sem. 2</span><span>Sem. 3</span><span>Sem. 4</span></div>
                </div>
                <div className="mt-3 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"><div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-xl bg-orange-100 text-orange-600"><LuCreditCard className="size-4" /></span><div><p className="text-xs font-semibold text-slate-800">Courses du marché</p><p className="text-[11px] text-slate-500">Aujourd’hui · Alimentation</p></div></div><span className="text-sm font-bold text-slate-800">− 12 500 FCFA</span></div>
            </div>
            <div className="absolute -bottom-5 -left-4 flex items-center gap-3 rounded-2xl border border-white bg-white px-4 py-3 shadow-xl shadow-slate-900/10 sm:-left-8"><span className="flex size-10 items-center justify-center rounded-full bg-blue-100 text-blue-700"><LuCheck className="size-5" /></span><div><p className="text-xs font-bold text-slate-900">Tout est sous contrôle</p><p className="text-[11px] text-slate-500">Votre budget, en un seul endroit</p></div></div>
        </div>
    )
}

export default function Home() {
    return (
        <>
        <main className="landing-page min-h-screen overflow-hidden bg-[#fbfcfa] text-slate-900">
            <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
                <Logo />
                <nav className="hidden items-center gap-8 md:flex" aria-label="Navigation principale"><a href="#fonctionnalites" className="text-sm font-medium text-slate-600 transition hover:text-blue-700">Fonctionnalités</a><a href="#comment-ca-marche" className="text-sm font-medium text-slate-600 transition hover:text-blue-700">Comment ça marche</a><a href="#a-propos" className="text-sm font-medium text-slate-600 transition hover:text-blue-700">À propos</a></nav>
                <div className="flex items-center gap-2 sm:gap-3"><Link href="/connexion" className="hidden rounded-full px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:inline-flex">Connexion</Link><Link href="/inscription" className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-blue-700 sm:px-5">Créer un compte <LuArrowRight className="size-4" /></Link></div>
            </header>

            <section className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pb-24 pt-12 sm:px-8 sm:pb-28 sm:pt-16 lg:grid-cols-[0.92fr_1.08fr] lg:gap-10 lg:px-10 lg:pb-36 lg:pt-20">
                <div className="relative z-10 max-w-xl">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3.5 py-2 text-xs font-semibold text-blue-800 shadow-sm"><LuSparkles className="size-4" /> Une gestion plus simple, chaque mois</div>
                    <h1 className="text-[2.7rem] font-extrabold leading-[1.08] tracking-[-0.055em] text-slate-950 sm:text-6xl lg:text-[4.15rem]">Votre budget, <span className="text-blue-600">plus clair.</span> Vos projets, plus proches.</h1>
                    <p className="mt-6 max-w-lg text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">Avec BudgetApp, organisez vos budgets, suivez vos dépenses et sachez où vous en êtes. Tout simplement.</p>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href="/inscription" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700">Commencer gratuitement <LuArrowRight className="size-4" /></Link><a href="#fonctionnalites" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">Découvrir l’application <LuArrowDownRight className="size-4" /></a></div>
                    <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-slate-500"><span className="inline-flex items-center gap-1.5"><LuCheck className="size-4 text-blue-600" /> Budgets mensuels</span><span className="inline-flex items-center gap-1.5"><LuCheck className="size-4 text-blue-600" /> Suivi des transactions</span><span className="inline-flex items-center gap-1.5"><LuCheck className="size-4 text-blue-600" /> Montants en FCFA</span></div>
                </div>
                <DashboardPreview />
                <div className="pointer-events-none absolute -right-32 top-4 size-[32rem] rounded-full bg-blue-100/50 blur-3xl" aria-hidden="true" />
                <div className="pointer-events-none absolute -left-48 bottom-0 size-96 rounded-full bg-blue-50 blur-3xl" aria-hidden="true" />
            </section>

            <section id="fonctionnalites" className="scroll-mt-12 border-y border-slate-100 bg-white px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
                <div className="mx-auto max-w-7xl"><div className="mx-auto max-w-2xl text-center"><p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">Pensé pour le quotidien</p><h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">Une meilleure vision de votre argent</h2><p className="mt-4 text-base leading-7 text-slate-600">Les bons repères pour préparer le mois, suivre les dépenses et garder le cap sur vos priorités.</p></div>
                    <div className="mt-12 grid gap-5 md:grid-cols-3">{avantages.map(({ icon: Icon, titre, texte }, index) => <article key={titre} className="group rounded-3xl border border-slate-100 bg-[#fbfcfa] p-6 transition hover:-translate-y-1 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-950/5 sm:p-8"><span className="flex size-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 transition group-hover:bg-blue-600 group-hover:text-white"><Icon className="size-5" /></span><p className="mt-7 text-xs font-bold uppercase tracking-widest text-slate-400">0{index + 1}</p><h3 className="mt-2 text-lg font-bold text-slate-900">{titre}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{texte}</p></article>)}</div>
                </div>
            </section>

            <section id="comment-ca-marche" className="scroll-mt-12 px-5 py-20 sm:px-8 sm:py-24 lg:px-10"><div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">Simple dès le départ</p><h2 className="mt-4 max-w-lg text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">Prenez vos repères en quelques étapes</h2><p className="mt-4 max-w-lg text-base leading-7 text-slate-600">Une organisation facile à suivre pour mieux comprendre votre mois, sans tableur compliqué.</p><Link href="/inscription" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-blue-700 transition hover:gap-3">Créer mon espace <LuArrowRight className="size-4" /></Link></div><ol className="space-y-4">{[{ n: "01", t: "Créez votre compte", d: "Inscrivez-vous pour retrouver vos données dans votre espace." }, { n: "02", t: "Définissez vos budgets", d: "Attribuez un montant à vos projets et postes de dépense du mois." }, { n: "03", t: "Ajoutez vos transactions", d: "Consignez vos dépenses pour suivre simplement le montant restant." }].map((etape) => <li key={etape.n} className="flex gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:gap-5 sm:p-6"><span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-extrabold text-blue-700">{etape.n}</span><div><h3 className="font-bold text-slate-900">{etape.t}</h3><p className="mt-1 text-sm leading-6 text-slate-600">{etape.d}</p></div></li>)}</ol></div></section>

            <section id="a-propos" className="scroll-mt-12 px-5 pb-20 sm:px-8 sm:pb-24 lg:px-10"><div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-12 text-white sm:px-10 sm:py-16 lg:px-16"><div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]"><div className="max-w-2xl"><span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-blue-300"><LuShieldCheck className="size-4" /> Votre espace personnel</span><h2 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl">Un peu plus de clarté peut tout changer.</h2><p className="mt-4 max-w-xl leading-7 text-slate-300">BudgetApp rassemble vos budgets et vos transactions dans une interface pensée pour vous aider à garder une vue d’ensemble.</p></div><Link href="/inscription" className="inline-flex min-h-12 items-center justify-center gap-2 self-start rounded-full bg-blue-500 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-blue-400 lg:self-center">Découvrir BudgetApp <LuArrowRight className="size-4" /></Link></div></div></section>

            <footer className="border-t border-slate-100 bg-white px-5 py-8 sm:px-8 lg:px-10"><div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row"><Logo /><p className="text-center text-xs text-slate-500">© {new Date().getFullYear()} BudgetApp · Une vision plus claire de votre budget.</p><Link href="/connexion" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 transition hover:text-blue-700">Accéder à mon compte <LuCircleHelp className="size-3.5" /></Link></div></footer>
        </main>
        <AmiaChatbot />
        </>
    )
}
