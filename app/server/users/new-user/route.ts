import { UserType } from "@/types"
import axios from "axios";
import { NextResponse } from "next/server"

export const POST = async (req: Request) => {
    try {

        //On recupère les infos du frontend
        const {nom, telephone, email, password, cpassword}: UserType = await req.json()

        //if(!id || id === "") return NextResponse.json({message: "id est obligatoire"});

        const user = await axios.post(`${process.env.db_url}/utilisateurs.json`,{nom,  telephone, email, password, cpassword} )

        return NextResponse.json({message: "Utilisateur ajouté avec succès!" })

    } catch (error) {
        console.log(error)
        return NextResponse.json({message: "Une erreur s'est produite !"})
    }
}