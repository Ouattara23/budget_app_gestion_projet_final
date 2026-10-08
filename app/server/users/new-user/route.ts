import axios from "axios"
import { NextResponse } from "next/server"

// Profil utilisateur (sans mot de passe : l'authentification est gérée par Firebase Auth)
export const POST = async (req: Request) => {
    try {
        const { id, nom, telephone, email, photoURL } = await req.json()

        if (typeof id !== "string" || id === "" || typeof nom !== "string" || nom.trim() === "")
            return NextResponse.json({ message: "Données invalides" }, { status: 400 })

        // On range le profil sous l'identifiant Firebase de l'utilisateur
        await axios.put(`${process.env.db_url}/utilisateurs/${encodeURIComponent(id)}.json?auth=${process.env.db_secret}`, { nom: nom.trim(), telephone: typeof telephone === "string" ? telephone.trim() : "", email, photoURL: typeof photoURL === "string" ? photoURL : "" })

        return NextResponse.json({ message: "Utilisateur ajouté avec succès" }, { status: 201 })

    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "Une erreur s'est produite" }, { status: 500 })
    }
}
