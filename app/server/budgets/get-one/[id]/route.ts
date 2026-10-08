import axios from "axios"
import { NextResponse } from "next/server"

export const GET = async (req: Request, { params }: { params: Promise<{id: string}>}) => {
    try {
        
        //On recupère le parametre id
        const { id } = await params 
        //On recupere le produit dans la db
        const p = await axios.get(`${process.env.db_url}/budgets/${id}.json?auth=${process.env.db_secret}`)

        // methode firebase
        /*const budget = await axios.get(`/serveur_url/budgets.json`)
        const tableauBudget = Object.entries(budget).map(([userId, item]) => ({userId, ...item}))
        tableauBudget.filter(item => item.userId === userId)*/
        

        return NextResponse.json({ budget: {id, ...p.data} })
        
    } catch (error) {
       console.log(error)
        return NextResponse.json({message: "Une erreur s'est produite."})
    }
}

