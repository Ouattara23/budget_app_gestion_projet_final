import axios from "axios"
import { NextResponse } from "next/server"

export const GET = async (req: Request, { params }: { params: Promise<{id: string}>}) => {
    try {
        
        //On recupère le parametre id
        const { id } = await params 

        //On recupere le produit dans la db
        const p = await axios.get(`${process.env.db_url}/transactions/${id}.json`)

        return NextResponse.json({ transactions: {id, ...p.data} })

    } catch (error) {
       console.log(error)
        return NextResponse.json({message: "Une erreur s'est produite."})
    }
}