"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { LuArrowUpRight, LuHouse, LuLogOut, LuMenu, LuReceipt, LuUserRound, LuWallet } from "react-icons/lu"
import { signOut } from "firebase/auth"
import { getFirebaseAuth } from "@/fireBaseConfig"
import { getSessionUser } from "@/lib/session"
import { useToast } from "./useToast"

const liens = [
    { href: "/tableau-de-bord", label: "Tableau de bord", Icone: LuHouse },
    { href: "/mes-budgets", label: "Mes budgets", Icone: LuWallet },
    { href: "/mes-transactions", label: "Mes transactions", Icone: LuReceipt },
    { href: "/mon-compte", label: "Mon compte", Icone: LuUserRound },
]

// Mise en page commune à toutes les pages connectées (remplace sidebar, sidebar2 et MesTransactions)
export default function AppShell({ titre, children }: { titre: string; children: React.ReactNode }) {
    const pathname = usePathname()
    const router = useRouter()
    const [nom, setNom] = useState<string | null>(null)
    const [photoURL, setPhotoURL] = useState<string | null>(null)
    const { afficher, ToastView } = useToast()

    useEffect(() => {
        setNom(getFirebaseAuth().currentUser?.displayName ?? getSessionUser()?.nom ?? null)
        setPhotoURL(getFirebaseAuth().currentUser?.photoURL ?? null)
        if (sessionStorage.getItem("inscription-reussie") === "true") {
            sessionStorage.removeItem("inscription-reussie")
            afficher("Inscription réussie")
        }
    }, [afficher])

    const fermerMenu = () => {
        const toggle = document.getElementById("app-drawer") as HTMLInputElement | null
        if (toggle) toggle.checked = false
    }

    const deconnexion = async () => {
        try {
            await signOut(getFirebaseAuth())
        } finally {
            localStorage.removeItem("user")
            router.push("/connexion")
        }
    }

    return (
        <div className="app-frame drawer lg:drawer-open min-h-screen">
            {ToastView}
            <input id="app-drawer" type="checkbox" className="drawer-toggle" />

            <div className="drawer-content flex flex-col">
                <header className="app-topbar navbar sticky top-0 z-20 px-4 sm:px-6 lg:px-10">
                    <label htmlFor="app-drawer" aria-label="Ouvrir le menu" className="app-menu-trigger btn btn-ghost btn-square lg:hidden">
                        <LuMenu className="size-5" />
                    </label>
                    <div className="app-heading flex-1 px-2 lg:px-0">
                        <span className="app-eyebrow hidden sm:block">Votre espace personnel</span>
                        <h1 className="text-lg sm:text-xl font-bold">{titre}</h1>
                    </div>
                    <Link href="/mon-compte" aria-label="Gérer mon compte" className="app-profile group flex max-w-[260px] items-center gap-3 rounded-2xl border border-blue-100/80 bg-white py-1.5 pl-3 pr-1.5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
                        <span className="hidden min-w-0 text-right sm:flex sm:flex-col">
                            <span className="truncate text-sm font-semibold text-slate-800">{nom || "Mon espace"}</span>
                            <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-700/75">Mon compte</span>
                        </span>
                        <span className="relative flex size-11 shrink-0 items-center justify-center rounded-full bg-blue-100 p-0.5 ring-2 ring-blue-100 ring-offset-2 ring-offset-white transition group-hover:ring-blue-200">
                            {photoURL ? (
                                <Image src={photoURL} alt="" width={44} height={44} unoptimized className="size-full rounded-full object-cover" />
                            ) : (
                                <span className="app-avatar flex size-full items-center justify-center rounded-full text-sm font-bold">
                                    {(nom || "?").charAt(0).toUpperCase()}
                                </span>
                            )}
                        </span>
                    </Link>
                </header>

                <main className="app-main w-full max-w-[1440px] mx-auto p-4 sm:p-6 lg:px-10 lg:py-8">{children}</main>
            </div>

            <div className="app-sidebar-wrap drawer-side z-30">
                <label htmlFor="app-drawer" aria-label="Fermer le menu" className="drawer-overlay"></label>
                <aside className="app-sidebar w-[278px] min-h-full flex flex-col px-5 py-6 lg:px-6">
                    <div className="app-brand flex items-center gap-3 px-2 py-3 text-xl font-bold">
                        <span className="app-brand-mark flex size-10 items-center justify-center rounded-xl"><LuWallet className="size-5" /></span>
                        <span>budget<span>App</span></span>
                    </div>

                    <div className="app-side-caption mt-11 px-3">Menu principal</div>

                    <nav className="mt-3 flex flex-col gap-1 grow" aria-label="Navigation principale">
                        {liens.map(({ href, label, Icone }) => {
                            const actif = pathname === href
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    onClick={fermerMenu}
                                    aria-current={actif ? "page" : undefined}
                                    className={`app-nav-link flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-colors ${actif ? "is-active" : ""}`}
                                >
                                    <Icone className="size-[18px]" />
                                    {label}
                                    {actif && <LuArrowUpRight className="app-nav-arrow ml-auto size-4" aria-hidden="true" />}
                                </Link>
                            )
                        })}
                    </nav>

                    <div className="app-sidebar-footer">
                        <div className="app-side-note mb-4 rounded-2xl p-4">
                            <span className="text-xs font-semibold uppercase tracking-[0.16em]">Gardez le cap</span>
                            <p className="mt-2 text-sm leading-5">Un suivi régulier rend chaque décision plus simple.</p>
                        </div>
                        <button onClick={deconnexion} className="app-logout flex w-full items-center gap-3 rounded-xl px-4 py-3 font-medium transition-colors">
                            <LuLogOut className="size-[18px]" />
                            Déconnexion
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    )
}
