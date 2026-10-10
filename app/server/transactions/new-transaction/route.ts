import { TransactionType } from "@/types"
import axios from "axios";
import { NextResponse } from "next/server"

export const POST = async (req: Request) => {
    try {
        const { date, objectif, budgetId, montant, userId, localBudgetId }: TransactionType = await req.json()

        /*if (typeof nomBudget !== "string" || nomBudget === "") 
            return NextResponse.json({ message: "Le nom est requis" }, { status: 400 });
        */
        const dateAjout = new Date()

        const transaction = await axios.post(
            `${process.env.db_url}/transactions.json?auth=${process.env.db_secret}`,
            { date, objectif, budgetId, montant, dateAjout, ...(userId ? { userId } : {}), ...(localBudgetId ? { localBudgetId } : {}) }
        )

        if (!transaction.data) 
            return NextResponse.json({ message: "Transaction non ajouté, veuillez réessayer." }, { status: 500 })

        return NextResponse.json({ message: "Transaction ajouté avec succès", idbudget: transaction.data.name }, { status: 201 })

    } catch (error) {
        console.error(error) // affiche l'erreur complète dans le terminal
        return NextResponse.json({ message: "Une erreur s'est produite" }, { status: 500 })
    }
}
