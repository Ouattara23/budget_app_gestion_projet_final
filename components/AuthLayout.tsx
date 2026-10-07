import { LuChartColumnBig, LuWallet } from "react-icons/lu"

type Props = {
    titre: string
    sousTitre: string
    children: React.ReactNode
}

// Mise en page partagée par les pages Connexion et Inscription (formulaire à gauche, visuel à droite)
export default function AuthLayout({ titre, sousTitre, children }: Props) {
    return (
        <section className="min-h-screen bg-slate-100 flex items-center justify-center p-4 lg:p-6">
            <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
                <div className="p-8 lg:p-14 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-sky-700 flex items-center justify-center text-white text-2xl">
                            <LuWallet />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-slate-800">
                                Budget<span className="text-sky-600">App</span>
                            </h2>
                            <p className="text-slate-500 text-sm">Gérez votre budget en toute simplicité</p>
                        </div>
                    </div>

                    <div className="text-center mb-6">
                        <h1 className="text-4xl font-bold text-slate-800 mb-2">{titre}</h1>
                        <p className="text-slate-500">{sousTitre}</p>
                    </div>

                    {children}
                </div>

                <div className="hidden lg:block relative">
                    <img src="/images/image1.jpeg" alt="" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-sky-800/60"></div>
                    <div className="absolute left-10 top-12 right-10 text-white">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-sky-600 text-3xl mb-8">
                            <LuChartColumnBig />
                        </div>
                        <h2 className="text-5xl font-bold leading-tight">
                            Maîtrisez <br /> vos finances
                        </h2>
                        <p className="mt-6 text-sky-100 max-w-sm">
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
            <span className="flex items-center gap-3 h-14 px-4 rounded-xl border border-slate-300 bg-white focus-within:border-sky-600 focus-within:ring-2 focus-within:ring-sky-100">
                <span className="text-slate-400">{icone}</span>
                {children}
            </span>
        </label>
    )
}
