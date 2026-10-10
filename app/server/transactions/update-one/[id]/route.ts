import axios from "axios"
import { NextResponse } from "next/server"

type Params = { params: Promise<{ id: string }> }

export const PATCH = async (req: Request, { params }: Params) => {
    try {
        const { id } = await params
        const { date, objectif, budgetId, montant, localBudgetId } = await req.json()

        if (typeof date !== "string" || !date || typeof objectif !== "string" || !objectif.trim()) {
            return NextResponse.json({ message: "La date et l'objectif sont requis." }, { status: 400 })
        }
        if (typeof budgetId !== "string" || !budgetId || !(Number(montant) > 0)) {
            return NextResponse.json({ message: "Le budget et le montant sont requis." }, { status: 400 })
        }

        const miseAJour: Record<string, string | number | null> = {
            date,
            objectif: objectif.trim(),
            budgetId,
            montant: Number(montant),
        }
        if (localBudgetId !== undefined) miseAJour.localBudgetId = localBudgetId

        const resultat = await axios.patch(
            `${process.env.db_url}/transactions/${encodeURIComponent(id)}.json?auth=${process.env.db_secret}`,
            miseAJour,
        )

        if (!resultat.data) {
            return NextResponse.json({ message: "La transaction est introuvable." }, { status: 404 })
        }

        return NextResponse.json({ message: "Transaction modifiée avec succès." })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "La modification de la transaction a échoué." }, { status: 500 })
    }
}
