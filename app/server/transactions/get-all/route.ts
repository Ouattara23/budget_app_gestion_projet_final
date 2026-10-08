import { TransactionType } from "@/types"
import axios from "axios"
import { NextResponse } from "next/server"

//Pour recuperer tous les produits de la db

interface TransactionsData {
  [id: string]: TransactionType;
}
export const GET = async (req: Request) => {
    try {
        
        const listeTransactions = await axios.get(`${process.env.db_url}/transactions.json?auth=${process.env.db_secret}`) 
        
        //On convertie l'objet json retourné en tableau js 
        const data = Object.entries(listeTransactions?.data as TransactionsData).map(([id, data]) => ({ id, ...data })) //retourne avec les id
        
        //const data2 = Object.values(produits.data) //retourne sans id

        return NextResponse.json({listeTransactions: data})
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({message: "Une erreur s'est produite."})
    }
}