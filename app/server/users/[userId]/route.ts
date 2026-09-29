import axios from "axios"


export const GET = async (req: Request, { params }: { params: Promise<{userId: string}>}) => {
    const {userId} = await params

    //userId
    // methode firebase
    const budget = await axios.get(`/serveur_url/budgets.json`)
    const tableauBudget = Object.entries(budget).map(([userId, item]) => ({userId, ...item}))
    tableauBudget.filter(item => item.userId === userId)
}