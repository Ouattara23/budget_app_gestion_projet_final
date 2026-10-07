import AppShell from "@/components/AppShell"
import MesTransactions from "@/components/MesTransactions"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Mes transactions",
    description: "Application de gestion de Budget",
}

export default function Page() {
    return (
        <AppShell titre="Mes transactions">
            <MesTransactions />
        </AppShell>
    )
}
