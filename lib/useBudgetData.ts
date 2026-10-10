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

async function lireBudgetsDistants(utilisateurId?: string): Promise<BudgetType[]> {
    if (!utilisateurId) return []

    try {
        const response = await fetch(`/server/budgets/get-all?userId=${encodeURIComponent(utilisateurId)}`, { cache: "no-store" })
        if (!response.ok) return []
        const resultat = await response.json() as { listeBudgets?: BudgetType[] }
        return resultat.listeBudgets ?? []
    } catch {
        // Les budgets locaux restent disponibles hors connexion ou si le serveur est indisponible.
        return []
    }
}

async function lireTransactionsDistantes(utilisateurId?: string): Promise<TransactionType[]> {
    if (!utilisateurId) return []

    try {
        const response = await fetch(`/server/transactions/get-all?userId=${encodeURIComponent(utilisateurId)}`, { cache: "no-store" })
        if (!response.ok) return []
        const resultat = await response.json() as { listeTransactions?: TransactionType[] }
        return resultat.listeTransactions ?? []
    } catch {
        return []
    }
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
        const uid = getSessionUser()?.id
        const [{ budgets: tousBudgets, transactions: toutesTransactions }, budgetsDistants, transactionsDistantes] = await Promise.all([
            lireDonnees(),
            lireBudgetsDistants(uid),
            lireTransactionsDistantes(uid),
        ])

        if (afficherSkeleton) {
            const tempsRestant = DUREE_MIN_SKELETON_MS - (Date.now() - debutLecture)
            if (tempsRestant > 0) await new Promise((resolve) => setTimeout(resolve, tempsRestant))
            premiereLecture.current = false
        }

        // Chaque utilisateur ne voit que ses budgets (les anciens budgets sans userId restent visibles)
        const budgetsLocaux = tousBudgets.filter((b) => !b.userId || b.userId === uid)
        const empreinte = (budget: BudgetType) => `${budget.nomBudget.trim().toLocaleLowerCase()}|${budget.montant}|${budget.mois}`
        const budgetsLocauxAssocies = budgetsLocaux.map((budget) => {
            const distant = budgetsDistants.find((candidat) => empreinte(candidat) === empreinte(budget))
            return distant?.id ? { ...budget, remoteId: String(distant.id) } : budget
        })
        const empreintesLocales = new Set(budgetsLocaux.map(empreinte))
        const mesBudgets = [
            ...budgetsLocauxAssocies,
            ...budgetsDistants.filter((budget) => !empreintesLocales.has(empreinte(budget))),
        ]
        const transactionsLocales = toutesTransactions.filter((transaction) => !transaction.userId || transaction.userId === uid)
        const cleTransaction = (transaction: TransactionType) => `${transaction.remoteBudgetId || transaction.budgetId}|${transaction.date}|${transaction.objectif.trim().toLocaleLowerCase()}|${transaction.montant}`
        const clesLocales = new Set(transactionsLocales.map(cleTransaction))
        const transactionsLocalesAssociees = transactionsLocales.map((transaction) => {
            const distante = transactionsDistantes.find((candidate) => cleTransaction(candidate) === cleTransaction(transaction))
            return distante?.id ? { ...transaction, remoteId: String(distante.id) } : transaction
        })
        const transactionsDistantesNormalisees = transactionsDistantes.map((transaction) => {
            const budgetLocal = transaction.localBudgetId
                ? budgetsLocaux.find((budget) => String(budget.id) === String(transaction.localBudgetId))
                : undefined
            return budgetLocal ? { ...transaction, budgetId: String(budgetLocal.id) } : transaction
        })
        const mesTransactions = [
            ...transactionsLocalesAssociees,
            ...transactionsDistantesNormalisees.filter((transaction) => !clesLocales.has(cleTransaction(transaction))),
        ]
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
