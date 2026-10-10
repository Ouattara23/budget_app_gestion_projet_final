import axios from "axios"
import { NextResponse } from "next/server"

export const DELETE = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    try {

        //On recupère le parametre id
        const { id } = await params

        //On recupere le produit dans la db
        const p = await axios.delete(`${process.env.db_url}/transactions/${id}.json?auth=${process.env.db_secret}`)

        //retourne 
        return NextResponse.json({ transaction: p.data  })

    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: "La suppression de la transaction a échoué." }, { status: 500 })
    }
}
