"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { LuHouse, LuLogOut, LuMenu, LuReceipt, LuWallet } from "react-icons/lu"
import { signOut } from "firebase/auth"
import { InitAuth } from "@/fireBaseConfig"
import { getSessionUser } from "@/lib/session"

const liens = [
    { href: "/tableau-de-bord", label: "Tableau de bord", Icone: LuHouse },
    { href: "/mes-budgets", label: "Mes budgets", Icone: LuWallet },
    { href: "/mes-transactions", label: "Mes transactions", Icone: LuReceipt },
]

// Mise en page commune à toutes les pages connectées (remplace sidebar, sidebar2 et MesTransactions)
export default function AppShell({ titre, children }: { titre: string; children: React.ReactNode }) {
    const pathname = usePathname()
    const router = useRouter()
    const [nom, setNom] = useState<string | null>(null)

    useEffect(() => {
        setNom(getSessionUser()?.nom ?? null)
    }, [])

    const fermerMenu = () => {
        const toggle = document.getElementById("app-drawer") as HTMLInputElement | null
        if (toggle) toggle.checked = false
    }

    const deconnexion = async () => {
        try {
            await signOut(InitAuth)
        } finally {
            localStorage.removeItem("user")
            router.push("/connexion")
        }
    }

    return (
        <div className="drawer lg:drawer-open min-h-screen bg-slate-50">
            <input id="app-drawer" type="checkbox" className="drawer-toggle" />

            <div className="drawer-content flex flex-col">
                <header className="navbar sticky top-0 z-20 bg-white border-b border-slate-200 px-4 lg:px-8">
                    <label htmlFor="app-drawer" aria-label="Ouvrir le menu" className="btn btn-ghost btn-square lg:hidden">
                        <LuMenu className="text-xl" />
                    </label>
                    <h1 className="flex-1 px-2 text-xl lg:text-2xl font-bold text-slate-800">{titre}</h1>
                    <div className="flex items-center gap-3">
                        {nom && <span className="hidden sm:block text-sm font-medium text-slate-600">{nom}</span>}
                        <span className="w-9 h-9 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center font-semibold">
                            {(nom || "?").charAt(0).toUpperCase()}
                        </span>
                    </div>
                </header>

                <main className="w-full max-w-7xl mx-auto p-4 lg:p-8">{children}</main>
            </div>

            <div className="drawer-side z-30">
                <label htmlFor="app-drawer" aria-label="Fermer le menu" className="drawer-overlay"></label>
                <aside className="w-64 min-h-full bg-sky-950 text-sky-100 flex flex-col p-4">
                    <div className="flex items-center gap-2 px-3 py-4 text-2xl font-bold text-white">
                        <LuWallet />
                        <span>Budget<span className="text-sky-400">App</span></span>
                    </div>

                    <nav className="mt-6 flex flex-col gap-1 grow" aria-label="Navigation principale">
                        {liens.map(({ href, label, Icone }) => {
                            const actif = pathname === href
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    onClick={fermerMenu}
                                    aria-current={actif ? "page" : undefined}
                                    className={`flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-colors ${actif ? "bg-sky-700 text-white" : "hover:bg-sky-900"}`}
                                >
                                    <Icone className="text-lg" />
                                    {label}
                                </Link>
                            )
                        })}
                    </nav>

                    <button onClick={deconnexion} className="flex items-center gap-3 rounded-xl px-4 py-3 font-medium text-red-300 hover:bg-sky-900 transition-colors">
                        <LuLogOut className="text-lg" />
                        Déconnexion
                    </button>
                </aside>
            </div>
        </div>
    )
}
