
export  type UserType = {
    id?: string,
    nom: string,
    telephone: string,
    email: string,
    password: string,
    cpassword: string
}

export type TransactionType = {
  id?: string,
  date: string,
  objectif: string,
  budgetId: string,
  montant: number,
  dateAjout: Date
}

export type BudgetType ={
    id?: string,
    nomBudget: string,
    montant: number,
    mois: string,
    userId: string
    //dateDebut: string
    //dateFin: string
}
