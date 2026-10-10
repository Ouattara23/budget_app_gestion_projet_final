import { BudgetType } from "@/types"
import axios from "axios";
import { NextResponse } from "next/server"

export const POST = async (req: Request) => {
    try {
        const { nomBudget, montant, mois, userId }: BudgetType = await req.json()

        if (typeof nomBudget !== "string" || nomBudget === "") 
            return NextResponse.json({ message: "Le nom est requis" }, { status: 400 });

        //const dateAjout = new Date()

        const budget = await axios.post(
            `${process.env.db_url}/budgets.json?auth=${process.env.db_secret}`,
            { nomBudget, montant, mois, ...(userId ? { userId } : {}) }
        )

        if (!budget.data) 
            return NextResponse.json({ message: "Budget non ajouté, veuillez réessayer." }, { status: 500 })

        return NextResponse.json({ message: "Budget ajouté avec succès", idbudget: budget.data.name }, { status: 201 })

    } catch (error) {
        console.error(error) // affiche l'erreur complète dans le terminal
        return NextResponse.json({ message: "Une erreur s'est produite" }, { status: 500 })
    }
}
