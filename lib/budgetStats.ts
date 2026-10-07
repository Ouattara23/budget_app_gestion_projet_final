import { BudgetType, TransactionType } from "@/types"

export const depenseDuBudget = (budget: BudgetType, transactions: TransactionType[]) =>
    transactions
        .filter((t) => String(t.budgetId) === String(budget.id))
        .reduce((total, t) => total + Number(t.montant || 0), 0)

export const resteDuBudget = (budget: BudgetType, transactions: TransactionType[]) =>
    Number(budget.montant || 0) - depenseDuBudget(budget, transactions)

export const pourcentage = (depense: number, total: number) =>
    total > 0 ? Math.round((depense / total) * 100) : 0

// Classe DaisyUI de la barre de progression : vert < 75 %, orange 75-100 %, rouge > 100 %
export const couleurProgression = (pct: number) =>
    pct > 100 ? "progress-error" : pct >= 75 ? "progress-warning" : "progress-success"
