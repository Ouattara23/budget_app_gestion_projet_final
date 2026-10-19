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
    LuGraduationCap,
    LuShieldCheck,
    LuSmartphone,
    LuTarget,
    LuTriangleAlert,
    LuUsers,
    LuWallet,
} from "react-icons/lu"
import AmiaChatbot from "@/components/AmiaChatbot"
import { AvertissementMock, ExportMock, HeroMock, RechercheMock, SignalCouleurMock } from "@/components/landing/Mockups"

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], display: "swap" })

const titre = "BudgetApp — Sachez où part votre argent"
const description =
    "Fixez un budget par poste, notez vos dépenses en quelques secondes et voyez d'un coup d'œil ce qu'il vous reste. En français, en FCFA, sans tableur."

export const metadata: Metadata = {
    title: titre,
    description,
    openGraph: { title: titre, description, type: "website", locale: "fr_FR", siteName: "BudgetApp" },
}

/* ---------- Données de la page ---------- */

const liens = [
    { href: "#fonctionnalites", libelle: "Fonctionnalités" },
    { href: "#comment-ca-marche", libelle: "Comment ça marche" },
    { href: "#faq", libelle: "Questions" },
]

const reperes: { icon: IconType; texte: string }[] = [
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

/* ---------- Petits éléments réutilisés ---------- */

function Logo({ clair = false }: { clair?: boolean }) {
    return (
        <Link href="/" aria-label="BudgetApp, accueil" className={`flex items-center gap-2.5 text-lg font-extrabold tracking-tight ${clair ? "text-white" : "text-[#142744]"}`}>
            <span className="flex size-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/30">
                <LuWallet className="size-5" />
            </span>
            <span>
                budget<span className={clair ? "text-blue-300" : "text-blue-600"}>App</span>
            </span>
        </Link>
    )
}

function Eyebrow({ children, clair = false }: { children: ReactNode; clair?: boolean }) {
    return <p className={`text-xs font-bold uppercase tracking-[0.18em] ${clair ? "text-sky-300" : "text-blue-700"}`}>{children}</p>
}

/* Halo et quadrillage discrets pour les bandeaux sombres */
function Decor() {
    return (
        <>
            <div className="landing-grid pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
            <div className="pointer-events-none absolute -right-32 -top-32 -z-10 size-[520px] rounded-full bg-blue-500/25 blur-3xl" aria-hidden="true" />
            <div className="pointer-events-none absolute -bottom-40 -left-40 -z-10 size-[420px] rounded-full bg-sky-400/10 blur-3xl" aria-hidden="true" />
        </>
    )
}

/* ---------- Page ---------- */

export default function Home() {
    return (
        <>
            <main className={`${jakarta.className} min-h-screen bg-[#f6f8fc] text-slate-900`}>
                {/* En-tête */}
                <header className="sticky top-0 z-40 border-b border-white/10 bg-[#142744]/85 backdrop-blur-md">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
                        <Logo clair />
                        <nav className="hidden items-center gap-9 md:flex" aria-label="Navigation principale">
                            {liens.map((l) => (
                                <a key={l.href} href={l.href} className="text-sm font-medium text-blue-100/80 transition hover:text-white">
                                    {l.libelle}
                                </a>
                            ))}
                        </nav>
                        <div className="flex items-center gap-2">
                            <Link href="/connexion" className="hidden rounded-full px-4 py-2 text-sm font-semibold text-blue-50 transition hover:bg-white/10 sm:inline-flex">
                                Connexion
                            </Link>
                            <Link href="/inscription" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#142744] transition hover:bg-blue-50">
                                Commencer <LuArrowRight className="size-4" />
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Hero */}
                <section className="relative isolate overflow-hidden bg-[#142744] text-white">
                    <Decor />
                    <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-5 pb-20 pt-14 sm:px-8 sm:pt-20 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10 lg:px-10 lg:pb-28 lg:pt-24">
                        <div className="landing-rise max-w-xl">
                            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-blue-100 ring-1 ring-white/15">
                                <span className="size-1.5 rounded-full bg-emerald-400" /> Application de budget · en FCFA
                            </span>
                            <h1 className="mt-6 text-balance text-[2.5rem] font-extrabold leading-[1.05] tracking-[-0.04em] sm:text-6xl lg:text-[3.6rem]">
                                Sachez où part votre argent, et <span className="landing-accent">ce qu&apos;il vous reste.</span>
                            </h1>
                            <p className="mt-6 text-base leading-7 text-blue-100/80 sm:text-lg sm:leading-8">
                                Fixez un budget par poste, notez vos dépenses en quelques secondes et lisez votre mois d&apos;un coup d&apos;œil. Sans tableur, sans jargon.
                            </p>
                            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                                <Link href="/inscription" className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-bold text-[#142744] shadow-[0_12px_30px_-10px_rgba(255,255,255,0.35)] transition hover:bg-blue-50">
                                    Créer mon compte gratuitement <LuArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                                </Link>
                                <a href="#comment-ca-marche" className="inline-flex min-h-12 items-center justify-center rounded-full px-7 text-sm font-semibold text-white ring-1 ring-white/25 transition hover:bg-white/10">
                                    Voir comment ça marche
                                </a>
                            </div>
                            <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-xs text-blue-100/70">
                                {["Gratuit pour démarrer", "Inscription en moins d'une minute", "Aucun compte bancaire à relier"].map((t) => (
                                    <li key={t} className="flex items-center gap-1.5">
                                        <LuCheck className="size-3.5 text-sky-300" /> {t}
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-5 text-sm text-blue-100/70">
                                Déjà inscrit ?{" "}
                                <Link href="/connexion" className="font-semibold text-white underline decoration-white/30 underline-offset-4 transition hover:decoration-white">
                                    Se connecter
                                </Link>
                            </p>
                        </div>
                        <HeroMock />
                    </div>
                </section>

                {/* Repères */}
                <section aria-label="En bref" className="border-b border-slate-200 bg-white">
                    <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-5 px-5 py-7 sm:px-8 lg:grid-cols-4 lg:px-10">
                        {reperes.map(({ icon: Icon, texte }) => (
                            <li key={texte} className="flex items-center justify-center gap-3 text-sm font-semibold text-slate-700">
                                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                                    <Icon className="size-4" />
                                </span>
                                {texte}
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Fonctionnalités */}
                <section id="fonctionnalites" className="scroll-mt-20 px-5 py-24 sm:px-8 lg:px-10 lg:py-28">
                    <div className="mx-auto max-w-7xl">
                        <div className="max-w-2xl">
                            <Eyebrow>Ce que vous pouvez faire</Eyebrow>
                            <h2 className="mt-4 text-balance text-3xl font-extrabold tracking-tight text-[#0f1d36] sm:text-4xl">Tout ce qu&apos;il faut pour tenir votre mois, rien de plus.</h2>
                            <p className="mt-4 text-base leading-7 text-slate-600">Des couleurs et des pourcentages plutôt que des colonnes de chiffres.</p>
                        </div>

                        <div className="mt-14 grid gap-5 md:grid-cols-6">
                            {/* Signal de couleur */}
                            <article className="landing-reveal flex flex-col rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_1px_2px_rgba(15,29,54,0.04)] sm:p-9 md:col-span-4">
                                <h3 className="text-xl font-bold tracking-tight text-[#0f1d36]">Un signal de couleur, en un coup d&apos;œil</h3>
                                <p className="mt-2 max-w-lg text-sm leading-6 text-slate-600">
                                    Chaque budget affiche ce qui est dépensé, ce qu&apos;il reste et le pourcentage consommé. Vert sous 75 %, orange de 75 à 100 %, rouge dès que le budget est dépassé.
                                </p>
                                <div className="mt-auto pt-8">
                                    <SignalCouleurMock />
                                </div>
                            </article>

                            {/* Avertissement doux */}
                            <article className="landing-reveal flex flex-col rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_1px_2px_rgba(15,29,54,0.04)] sm:p-9 md:col-span-2">
                                <h3 className="text-xl font-bold tracking-tight text-[#0f1d36]">On vous prévient, on ne vous bloque jamais</h3>
                                <p className="mt-2 text-sm leading-6 text-slate-600">Une dépense dépasse ce qu&apos;il reste dans le budget choisi ? Un avertissement apparaît. Vous gardez la main.</p>
                                <div className="mt-auto pt-8">
                                    <AvertissementMock />
                                </div>
                            </article>

                            {/* Recherche */}
                            <article className="landing-reveal flex flex-col rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_1px_2px_rgba(15,29,54,0.04)] sm:p-9 md:col-span-3">
                                <h3 className="text-xl font-bold tracking-tight text-[#0f1d36]">Retrouvez chaque dépense</h3>
                                <p className="mt-2 text-sm leading-6 text-slate-600">Recherche par mot-clé, filtres par période et par budget. Le total se met à jour selon vos filtres.</p>
                                <div className="mt-auto pt-8">
                                    <RechercheMock />
                                </div>
                            </article>

                            {/* Export */}
                            <article className="landing-reveal flex flex-col rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_1px_2px_rgba(15,29,54,0.04)] sm:p-9 md:col-span-3">
                                <h3 className="text-xl font-bold tracking-tight text-[#0f1d36]">Un export compatible Excel</h3>
                                <p className="mt-2 text-sm leading-6 text-slate-600">Un clic pour obtenir un fichier au format français, pratique pour partager ou archiver.</p>
                                <div className="mt-auto pt-8">
                                    <ExportMock />
                                </div>
                            </article>
                        </div>
                    </div>
                </section>

                {/* Comment ça marche */}
                <section id="comment-ca-marche" className="scroll-mt-20 border-y border-slate-200 bg-white px-5 py-24 sm:px-8 lg:px-10 lg:py-28">
                    <div className="mx-auto grid max-w-7xl items-start gap-14 lg:grid-cols-2 lg:gap-20">
                        <div>
                            <Eyebrow>Simple dès le départ</Eyebrow>
                            <h2 className="mt-4 max-w-lg text-balance text-3xl font-extrabold tracking-tight text-[#0f1d36] sm:text-4xl">Trois gestes, et vous savez où en est votre mois.</h2>
                            <ol className="relative mt-10 space-y-9 before:absolute before:bottom-3 before:left-5 before:top-3 before:w-px before:bg-slate-200">
                                {etapes.map((e, i) => (
                                    <li key={e.titre} className="relative flex gap-5">
                                        <span className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full bg-[#142744] text-sm font-bold text-white ring-4 ring-white">{i + 1}</span>
                                        <div>
                                            <h3 className="font-bold text-[#0f1d36]">{e.titre}</h3>
                                            <p className="mt-1 text-sm leading-6 text-slate-600">{e.texte}</p>
                                            <p className="mt-2.5 inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">{e.duree}</p>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </div>

                        <aside className="relative isolate overflow-hidden rounded-3xl bg-[#142744] p-7 text-white sm:p-10">
                            <div className="pointer-events-none absolute -right-24 -top-24 -z-10 size-72 rounded-full bg-blue-500/25 blur-3xl" aria-hidden="true" />
                            <p className="text-[10px] font-extrabold uppercase tracking-[0.17em] text-sky-300">Exemple illustratif</p>
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
                                        <span className="tabular-nums text-blue-100/80">{montant} FCFA</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-6 flex gap-3.5 rounded-2xl bg-amber-400/10 p-4 ring-1 ring-amber-300/25">
                                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-amber-400/20 text-amber-200">
                                    <LuTriangleAlert className="size-4" />
                                </span>
                                <p className="text-sm leading-6 text-amber-50/90">
                                    Un après-midi, elle ajoute 12 500 FCFA de courses au marché. L&apos;application la prévient : ce montant dépasse ce qu&apos;il reste dans son budget Alimentation.
                                </p>
                            </div>
                            <p className="mt-5 text-sm leading-7 text-blue-100/85">Elle ajuste ses achats de la semaine et termine le mois sans mauvaise surprise.</p>
                        </aside>
                    </div>
                </section>

                {/* Pour qui */}
                <section className="px-5 py-24 sm:px-8 lg:px-10 lg:py-28">
                    <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
                        <div>
                            <Eyebrow>Pour qui ?</Eyebrow>
                            <h2 className="mt-4 text-balance text-3xl font-extrabold tracking-tight text-[#0f1d36] sm:text-4xl">Reprendre la main sur son argent, sans devenir comptable.</h2>
                            <p className="mt-4 text-base leading-7 text-slate-600">Pensé pour le quotidien en Afrique francophone : monnaie en FCFA, interface en français, dates à la française.</p>
                        </div>
                        <div className="grid gap-x-12 gap-y-10 sm:grid-cols-2">
                            {publics.map(({ icon: Icon, titre, texte }) => (
                                <article key={titre} className="landing-reveal border-t border-slate-300 pt-6">
                                    <Icon className="size-6 text-blue-600" />
                                    <h3 className="mt-4 font-bold leading-snug text-[#0f1d36]">{titre}</h3>
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
                    <div className="relative isolate mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#142744] px-7 py-16 text-center text-white sm:px-12 sm:py-24">
                        <Decor />
                        <h2 className="mx-auto max-w-2xl text-balance text-3xl font-extrabold tracking-tight sm:text-5xl">Votre budget, plus clair. Vos projets, plus proches.</h2>
                        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-blue-100/80">Créez votre compte, ajoutez votre premier budget, notez votre première dépense.</p>
                        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                            <Link href="/inscription" className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-bold text-[#142744] transition hover:bg-blue-50">
                                Créer mon compte gratuitement <LuArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                            </Link>
                            <Link href="/connexion" className="inline-flex min-h-12 items-center justify-center rounded-full px-7 text-sm font-semibold text-white ring-1 ring-white/25 transition hover:bg-white/10">
                                J&apos;ai déjà un compte
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Pied de page */}
                <footer className="bg-[#0d1b33] px-5 py-14 text-blue-100/70 sm:px-8 lg:px-10">
                    <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
                        <div>
                            <Logo clair />
                            <p className="mt-4 max-w-xs text-sm leading-6">Une vision plus claire de votre budget. Gratuit pour démarrer, en français et en FCFA.</p>
                        </div>
                        <nav aria-label="Pied de page, le produit">
                            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white">Le produit</p>
                            <ul className="mt-4 space-y-3 text-sm">
                                {liens.map((l) => (
                                    <li key={l.href}>
                                        <a href={l.href} className="transition hover:text-white">
                                            {l.libelle}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                        <nav aria-label="Pied de page, votre compte">
                            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white">Votre compte</p>
                            <ul className="mt-4 space-y-3 text-sm">
                                <li>
                                    <Link href="/connexion" className="transition hover:text-white">
                                        Connexion
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/inscription" className="transition hover:text-white">
                                        Inscription
                                    </Link>
                                </li>
                                <li className="text-blue-100/60">Une question ? Amia est en bas à droite.</li>
                            </ul>
                        </nav>
                    </div>
                    <p className="mx-auto mt-12 max-w-7xl border-t border-white/10 pt-6 text-xs text-blue-100/50">© {new Date().getFullYear()} BudgetApp</p>
                </footer>
            </main>
            <AmiaChatbot />
        </>
    )
}
