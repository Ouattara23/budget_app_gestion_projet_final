import type { Metadata } from "next"
import MonCompte from "@/components/MonCompte"

export const metadata: Metadata = {
    title: "Mon compte | BudgetApp",
    description: "Gérez votre profil et votre photo de compte BudgetApp.",
}

export default function Page() {
    return <MonCompte />
}
