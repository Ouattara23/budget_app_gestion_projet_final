import { LuChartColumnBig, LuWallet } from "react-icons/lu"

type Props = {
    titre: string
    sousTitre: string
    children: React.ReactNode
}

// Mise en page partagée par les pages Connexion et Inscription (formulaire à gauche, visuel à droite)
export default function AuthLayout({ titre, sousTitre, children }: Props) {
    return (
        <section className="auth-page min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-10">
            <div className="auth-card w-full max-w-6xl rounded-[2rem] overflow-hidden grid grid-cols-1 lg:grid-cols-2">
                <div className="auth-form-panel p-6 sm:p-9 lg:p-14 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="auth-brand-mark w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl">
                            <LuWallet />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">
                                budget<span className="text-blue-600">App</span>
                            </h2>
                            <p className="text-slate-500 text-sm">Gérez votre budget en toute simplicité</p>
                        </div>
                    </div>

                    <div className="auth-title text-center mb-7">
                        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">{titre}</h1>
                        <p className="text-slate-500">{sousTitre}</p>
                    </div>

                    {children}
                </div>

                <div className="auth-visual hidden lg:block relative">
                    <img src="/images/image1.jpeg" alt="" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="auth-visual-overlay absolute inset-0"></div>
                    <div className="absolute left-10 top-12 right-10 text-white">
                        <div className="auth-visual-icon w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-8">
                            <LuChartColumnBig />
                        </div>
                        <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-blue-200">Clarté au quotidien</p>
                        <h2 className="text-5xl font-bold leading-tight">
                            Prenez le contrôle <br /> de vos finances
                        </h2>
                        <p className="mt-6 text-blue-100 max-w-sm">
                            Suivez vos dépenses, gérez vos revenus et atteignez vos objectifs d&apos;épargne.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

// Champ de formulaire avec icône (même rendu partout)
export function Champ({ label, icone, children }: { label: string; icone: React.ReactNode; children: React.ReactNode }) {
    return (
        <label className="block">
            <span className="block mb-1.5 font-medium text-slate-700">{label}</span>
            <span className="auth-field flex items-center gap-3 h-14 px-4 rounded-xl border border-slate-300 bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100">
                <span className="auth-field-icon text-slate-400">{icone}</span>
                {children}
            </span>
        </label>
    )
}
