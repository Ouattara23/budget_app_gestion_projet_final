"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { getAllDataTodatabase } from "@/lib/IndexDB/getAllDB"
import { getSessionUser } from "@/lib/session"
import { BudgetType, TransactionType } from "@/types"

const lire = <T,>(table: string) =>
    new Promise<T[]>((resolve) => getAllDataTodatabase(table, (data: T[]) => resolve(data || [])))

type CacheDonnees = {
    utilisateurId?: string
    budgets: BudgetType[]
    transactions: TransactionType[]
}

let cacheDonnees: CacheDonnees | null = null
let lectureEnCours: Promise<{ budgets: BudgetType[]; transactions: TransactionType[] }> | null = null
const DUREE_MIN_SKELETON_MS = 600

function lireCache(): CacheDonnees | null {
    if (typeof window === "undefined") return null
    const utilisateurId = getSessionUser()?.id
    return cacheDonnees?.utilisateurId === utilisateurId ? cacheDonnees : null
}

function lireDonnees(): Promise<{ budgets: BudgetType[]; transactions: TransactionType[] }> {
    if (!lectureEnCours) {
        lectureEnCours = Promise.all([
            lire<BudgetType>("budgets"),
            lire<TransactionType>("transactions"),
        ]).then(([budgets, transactions]) => ({ budgets, transactions }))
            .finally(() => { lectureEnCours = null })
    }
    return lectureEnCours
}

// Source unique des données : les composants appellent refresh() après chaque modification
// (plus besoin de recopier les changements à la main dans plusieurs états).
export function useBudgetData() {
    const cacheInitial = useRef<CacheDonnees | null>(null)
    if (cacheInitial.current === null) cacheInitial.current = lireCache()
    const [budgets, setBudgets] = useState<BudgetType[]>(() => cacheInitial.current?.budgets ?? [])
    const [transactions, setTransactions] = useState<TransactionType[]>(() => cacheInitial.current?.transactions ?? [])
    // Le skeleton reste visible jusqu'à la fin de la lecture IndexedDB, même si un cache existe.
    const [loading, setLoading] = useState(true)
    const premiereLecture = useRef(true)

    const refresh = useCallback(async () => {
        const afficherSkeleton = premiereLecture.current
        const debutLecture = Date.now()
        const { budgets: tousBudgets, transactions: toutesTransactions } = await lireDonnees()

        if (afficherSkeleton) {
            const tempsRestant = DUREE_MIN_SKELETON_MS - (Date.now() - debutLecture)
            if (tempsRestant > 0) await new Promise((resolve) => setTimeout(resolve, tempsRestant))
            premiereLecture.current = false
        }

        // Chaque utilisateur ne voit que ses budgets (les anciens budgets sans userId restent visibles)
        const uid = getSessionUser()?.id
        const mesBudgets = tousBudgets.filter((b) => !b.userId || b.userId === uid)
        const ids = new Set(mesBudgets.map((b) => String(b.id)))

        const mesTransactions = toutesTransactions.filter((t) => ids.has(String(t.budgetId)))
        cacheDonnees = {
            utilisateurId: uid,
            budgets: mesBudgets,
            transactions: mesTransactions,
        }
        setBudgets(mesBudgets)
        setTransactions(mesTransactions)
        setLoading(false)
    }, [])

    useEffect(() => {
        void refresh()
    }, [refresh])

    return { budgets, transactions, loading, refresh }
}
