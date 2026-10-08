const navigation = [
    "Tableau de bord",
    "Mes budgets",
    "Mes transactions",
]

function Placeholder({ className = "" }: { className?: string }) {
    return <div aria-hidden="true" className={`skeleton rounded-xl ${className}`} />
}

function TableauDeBordSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <Placeholder className="h-4 w-56" />
                <Placeholder className="h-12 w-44 rounded-[13px]" />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {[1, 2, 3].map((item) => (
                    <div key={item} className="workspace-stat min-h-[128px] flex items-center justify-between gap-4">
                        <div className="space-y-3">
                            <Placeholder className="h-4 w-32" />
                            <Placeholder className="h-8 w-40" />
                        </div>
                        <Placeholder className="size-14 rounded-full" />
                    </div>
                ))}
            </div>
            <div className="workspace-panel min-h-28 space-y-4">
                <div className="flex justify-between gap-4">
                    <Placeholder className="h-4 w-28" />
                    <Placeholder className="h-4 w-10" />
                </div>
                <Placeholder className="h-3 w-full rounded-full" />
            </div>
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                {[1, 2].map((panel) => (
                    <div key={panel} className="workspace-panel space-y-5">
                        <div className="flex items-center justify-between">
                            <Placeholder className="h-5 w-40" />
                            <Placeholder className="h-4 w-12" />
                        </div>
                        {[1, 2, 3].map((row) => (
                            <div key={row} className="space-y-2">
                                <div className="flex justify-between gap-4">
                                    <Placeholder className="h-4 w-28" />
                                    <Placeholder className="h-4 w-32" />
                                </div>
                                <Placeholder className="h-2 w-full rounded-full" />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}

function BudgetsSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <Placeholder className="h-12 w-44 rounded-[13px]" />
                <div className="flex gap-2">
                    <Placeholder className="h-11 w-40 rounded-xl" />
                    <Placeholder className="h-11 w-36 rounded-xl" />
                </div>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((card) => (
                    <div key={card} className="workspace-budget-card space-y-5">
                        <div className="flex items-start justify-between gap-3">
                            <div className="space-y-2">
                                <Placeholder className="h-5 w-32" />
                                <Placeholder className="h-4 w-24" />
                            </div>
                            <Placeholder className="h-5 w-24" />
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between gap-4">
                                <Placeholder className="h-4 w-28" />
                                <Placeholder className="h-4 w-10" />
                            </div>
                            <Placeholder className="h-2 w-full rounded-full" />
                            <Placeholder className="h-4 w-32" />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Placeholder className="h-9 w-24 rounded-xl" />
                            <Placeholder className="h-9 w-24 rounded-xl" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function TransactionsSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
                <Placeholder className="h-12 w-full rounded-[13px] sm:w-64" />
                <Placeholder className="h-12 w-full rounded-[13px] sm:w-44" />
                <Placeholder className="h-12 w-full rounded-[13px] sm:w-40" />
                <div className="ml-auto flex gap-2">
                    <Placeholder className="h-11 w-28 rounded-xl" />
                    <Placeholder className="h-11 w-44 rounded-xl" />
                </div>
            </div>
            <div className="workspace-table overflow-hidden">
                <div className="flex h-12 items-center gap-6 bg-[#1e3a68] px-5">
                    {["w-32", "w-40", "w-28", "w-24", "w-20"].map((width, index) => (
                        <Placeholder key={index} className={`h-3 ${width} bg-white/20`} />
                    ))}
                </div>
                <div className="divide-y divide-slate-100 px-5">
                    {[1, 2, 3, 4, 5, 6].map((row) => (
                        <div key={row} className="flex min-h-14 items-center gap-6">
                            {["w-32", "w-40", "w-28", "w-24", "w-20"].map((width, index) => (
                                <Placeholder key={index} className={`h-4 ${width}`} />
                            ))}
                        </div>
                    ))}
                </div>
                <div className="flex justify-between border-t border-slate-200 bg-slate-50 px-5 py-4">
                    <Placeholder className="h-4 w-36" />
                    <Placeholder className="h-4 w-24" />
                </div>
            </div>
        </div>
    )
}

export function WorkspaceContentSkeleton({ page }: { page: "budgets" | "dashboard" | "transactions" }) {
    return (
        <div role="status" aria-live="polite">
            <span className="sr-only">Chargement de la page…</span>
            {page === "budgets" && <BudgetsSkeleton />}
            {page === "dashboard" && <TableauDeBordSkeleton />}
            {page === "transactions" && <TransactionsSkeleton />}
        </div>
    )
}

export default function WorkspaceLoading({ page }: { page: "budgets" | "dashboard" | "transactions" }) {
    const titles = {
        budgets: "Mes budgets",
        dashboard: "Tableau de bord",
        transactions: "Mes transactions",
    }

    return (
        <div className="app-frame drawer lg:drawer-open min-h-screen" aria-busy="true" aria-label={`Chargement : ${titles[page]}`}>
            <div className="drawer-content flex flex-col">
                <header className="app-topbar navbar sticky top-0 z-20 px-4 sm:px-6 lg:px-10">
                    <div className="app-heading flex-1 px-2 lg:px-0">
                        <span className="app-eyebrow hidden sm:block">Votre espace personnel</span>
                        <h1 className="text-lg font-bold sm:text-xl">{titles[page]}</h1>
                    </div>
                    <div className="app-profile flex items-center gap-3">
                        <Placeholder className="hidden h-4 w-24 sm:block" />
                        <Placeholder className="size-10 rounded-full" />
                    </div>
                </header>
                <main className="app-main mx-auto w-full max-w-[1440px] p-4 sm:p-6 lg:px-10 lg:py-8">
                    <div className="workspace-page">
                        <WorkspaceContentSkeleton page={page} />
                    </div>
                </main>
            </div>
            <aside className="app-sidebar-wrap drawer-side z-30" aria-hidden="true">
                <div className="app-sidebar w-[278px] min-h-full flex flex-col px-5 py-6 lg:px-6">
                    <div className="app-brand flex items-center gap-3 px-2 py-3 text-xl font-bold">
                        <Placeholder className="size-10 rounded-xl" />
                        <Placeholder className="h-6 w-28" />
                    </div>
                    <Placeholder className="mt-11 ml-3 h-3 w-24" />
                    <nav className="mt-3 flex grow flex-col gap-1">
                        {navigation.map((label) => (
                            <div key={label} className="flex min-h-12 items-center gap-3 rounded-xl px-4 py-3">
                                <Placeholder className="size-[18px] rounded-md" />
                                <Placeholder className="h-4 w-32" />
                            </div>
                        ))}
                    </nav>
                    <Placeholder className="mb-4 h-24 w-full rounded-2xl" />
                    <Placeholder className="h-11 w-36" />
                </div>
            </aside>
        </div>
    )
}
