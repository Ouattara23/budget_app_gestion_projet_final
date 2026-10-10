import axios from "axios"
import { NextResponse } from "next/server"

type Params = { params: Promise<{ id: string }> }

export const PATCH = async (req: Request, { params }: Params) => {
    try {
        const { id } = await params
        const { nomBudget, montant, mois } = await req.json()

        if (typeof nomBudget !== "string" || !nomBudget.trim()) {
            return NextResponse.json({ message: "Le nom est requis." }, { status: 400 })
        }
        if (!(Number(montant) > 0) || typeof mois !== "string" || !mois) {
            return NextResponse.json({ message: "Le montant et le mois sont requis." }, { status: 400 })
        }

        const resultat = await axios.patch(
            `${process.env.db_url}/budgets/${encodeURIComponent(id)}.json?auth=${process.env.db_secret}`,
            { nomBudget: nomBudget.trim(), montant: Number(montant), mois },
        )

        if (!resultat.data) {
            return NextResponse.json({ message: "Le budget est introuvable." }, { status: 404 })
        }

        return NextResponse.json({ message: "Budget modifié avec succès." })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "La modification du budget a échoué." }, { status: 500 })
    }
}
