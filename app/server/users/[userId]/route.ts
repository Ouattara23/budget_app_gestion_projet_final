import axios from "axios"
import { NextResponse } from "next/server"

export const GET = async (_req: Request, { params }: { params: Promise<{ userId: string }> }) => {
    try {
        const { userId } = await params
        const { data } = await axios.get(`${process.env.db_url}/utilisateurs/${encodeURIComponent(userId)}.json?auth=${process.env.db_secret}`)
        return NextResponse.json(data ?? {})
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "Impossible de charger le profil" }, { status: 500 })
    }
}
