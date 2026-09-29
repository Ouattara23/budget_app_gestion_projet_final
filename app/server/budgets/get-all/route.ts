import { BudgetType } from "@/types"
import axios from "axios"
import { NextResponse } from "next/server"

//Pour recuperer tous les produits de la db

interface BudgetsData {
  [id: string]: BudgetType;
}
export const GET = async (req: Request) => {
    try {
        //On recupère le parametre id
        //const { userId } = await params
        
        const listeBudgets = await axios.get(`${process.env.db_url}/budgets.json`) 
        
        //On convertie l'objet json retourné en tableau js 
        const data = Object.entries(listeBudgets?.data as BudgetsData).map(([id, data]) => ({ id, ...data })) //retourne avec les id

        
        //const data2 = Object.values(produits.data) //retourne sans id

        return NextResponse.json({listeBudgets: data})
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({message: "Une erreur s'est produite."})
    }
}