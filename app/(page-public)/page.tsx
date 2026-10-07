import { redirect } from "next/navigation"

// La racine envoie vers le tableau de bord (AuthProvider renvoie vers /connexion si non connecté)
export default function Home() {
    redirect("/connexion")
}
