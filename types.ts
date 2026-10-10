export type UserType = {
    id?: string,
    nom: string,
    telephone: string,
    email: string,
    password: string,
    cpassword: string
}

// Ce qui est conservé côté navigateur après connexion (jamais de mot de passe)
export type SessionUser = {
    id: string,
    nom: string | null
}

export type TransactionType = {
    id?: number | string,
    date: string,
    objectif: string,
    budgetId: string,
    montant: number,
    dateAjout?: Date | string,
    userId?: string,
    localBudgetId?: string,
    remoteBudgetId?: string,
    remoteId?: string
}

export type BudgetType = {
    id?: number | string,
    nomBudget: string,
    montant: number,
    mois: string, // format AAAA-MM
    userId?: string,
    remoteId?: string
}
