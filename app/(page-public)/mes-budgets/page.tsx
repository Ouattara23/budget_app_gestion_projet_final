import AppShell from "@/components/AppShell"
import Cardbudget from "@/components/cardbudget"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Mes budgets",
    description: "Application de gestion de Budget",
}

export default function Page() {
    return (
        <AppShell titre="Mes budgets">
            <Cardbudget />
        </AppShell>
    )
}
