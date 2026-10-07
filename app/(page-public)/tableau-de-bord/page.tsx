import AppShell from "@/components/AppShell"
import DashBord from "@/components/DashBord"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Tableau de bord",
    description: "Application de gestion de Budget",
}

export default function Page() {
    return (
        <AppShell titre="Tableau de bord">
            <DashBord />
        </AppShell>
    )
}
