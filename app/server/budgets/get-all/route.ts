import { BudgetType } from "@/types"
import axios from "axios"
import { NextResponse } from "next/server"

//Pour recuperer tous les produits de la db

interface BudgetsData {
  [id: string]: BudgetType;
}
export const GET = async (req: Request) => {
    try {
        const userId = new URL(req.url).searchParams.get("userId")
        //On recupère le parametre id
        //const { userId } = await params
        
        const listeBudgets = await axios.get(`${process.env.db_url}/budgets.json?auth=${process.env.db_secret}`) 
        
        //On convertie l'objet json retourné en tableau js 
        const data = Object.entries((listeBudgets?.data ?? {}) as BudgetsData)
            .map(([id, budget]) => ({ id, ...budget }))
            .filter((budget) => !budget.userId || budget.userId === userId)

        
        //const data2 = Object.values(produits.data) //retourne sans id

        return NextResponse.json({listeBudgets: data})
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({message: "Une erreur s'est produite."})
    }
}
