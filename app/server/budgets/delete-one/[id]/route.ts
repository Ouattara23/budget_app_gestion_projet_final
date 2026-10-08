import axios from "axios"
import { NextResponse } from "next/server"

export const DELETE = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    try {

        //On recupère le parametre id
        const { id } = await params

        //On recupere le produit dans la db
        const p = await axios.delete(`${process.env.db_url}/budgets/${id}.json?auth=${process.env.db_secret}`)

        //retourne 
        return NextResponse.json({ budget: p.data  })

    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: "Une erreur s'est produite." })
    }
}