"use client"

import { useCallback, useEffect, useState } from "react"
import { getAllDataTodatabase } from "@/lib/IndexDB/getAllDB"
import { getSessionUser } from "@/lib/session"
import { BudgetType, TransactionType } from "@/types"

const lire = <T,>(table: string) =>
    new Promise<T[]>((resolve) => getAllDataTodatabase(table, (data: T[]) => resolve(data || [])))

// Source unique des données : les composants appellent refresh() après chaque modification
// (plus besoin de recopier les changements à la main dans plusieurs états).
export function useBudgetData() {
    const [budgets, setBudgets] = useState<BudgetType[]>([])
    const [transactions, setTransactions] = useState<TransactionType[]>([])
    const [loading, setLoading] = useState(true)

    const refresh = useCallback(async () => {
        const [tousBudgets, toutesTransactions] = await Promise.all([
            lire<BudgetType>("budgets"),
            lire<TransactionType>("transactions"),
        ])

        // Chaque utilisateur ne voit que ses budgets (les anciens budgets sans userId restent visibles)
        const uid = getSessionUser()?.id
        const mesBudgets = tousBudgets.filter((b) => !b.userId || b.userId === uid)
        const ids = new Set(mesBudgets.map((b) => String(b.id)))

        setBudgets(mesBudgets)
        setTransactions(toutesTransactions.filter((t) => ids.has(String(t.budgetId))))
        setLoading(false)
    }, [])

    useEffect(() => {
        refresh()
    }, [refresh])

    return { budgets, transactions, loading, refresh }
}
