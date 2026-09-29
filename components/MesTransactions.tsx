"use client"

import { LuCircleUser, LuHouse, LuLogOut, LuMenu, LuSlidersHorizontal, LuWallet } from 'react-icons/lu'
import Gestioncompte from './gestioncompte'
import Link from 'next/link'
import TablesDesTransactions from './TablesDesTransactions'
import { BudgetType, TransactionType, UserType } from '@/types'
import { SetStateAction, useEffect, useState } from 'react'
import { getAllDataTodatabase } from '@/lib/IndexDB/getAllDB'
import recupererUser from './RecupererUser'

function MesTransactions({listeBudgets, setListeBudgets}:{listeBudgets: BudgetType[], setListeBudgets:React.Dispatch<SetStateAction<BudgetType[]>>}) {
    // les transactions
    const [listeTransactions, setListeTransactions] = useState<TransactionType[]>([]);
   // const [listeTransactions, setListeTransactions] = useState<TransactionType[]>([]);
   const [utilisateur, setUtilisateur] = useState<UserType | null>(null)
    

   useEffect(() => {
           if (typeof window === "undefined") return;
   
           getAllDataTodatabase("budgets", (data: any) => {
               console.log("Budgets récupérés :", data);
               setListeBudgets(data || []);
           });

           //utilisateur
            const user = recupererUser()
           
            setUtilisateur(user)
       }, []);


    return (
        <>
            {/* side barre */}
            <div className="drawer lg:drawer-open">
                <input id="my-drawer-4" type="checkbox" className="drawer-toggle inline" />
                <div className="drawer-content">
                    {/* Navbar */}
                    <nav className="navbar w-full bg-sky-900 text-lg text-white flex justify-between px-5">
                        <div className='flex items-center justify-center'>
                            <label htmlFor="my-drawer-4" aria-label="open sidebar" className="btn btn-square btn-ghost drawer-button">
                                {/* Sidebar toggle icon */}
                                <LuMenu className='text-xl text-white font-bold' />
                            </label>
                            <div className="px-4">Bienvenue <span className="font-bold">{utilisateur?.nom}</span></div>
                        </div>

                        {/* compte */}
                        <div>
                            <Gestioncompte />
                        </div>
                    </nav>

                    {/* Page content here */}
                    <div className="p-4 px-5 lg:px-15 lg:mt-5">
                        <div className='flex justify-between items-center gap-5'>
                            <h2 className='font-semibold text-2xl'>Mes Transactions</h2>
                            <select className="select select-bordered w-full max-w-xs outline-none">
                                <option value="all">Toutes les transactions</option>
                                <option value="current-month">Ce mois-ci</option>
                                <option value="last-month">Le mois dernier</option>
                                <option value="3-months">3 derniers mois</option>
                                <option value="year">Cette année</option>
                            </select>
                        </div>
                        
                        {/* table des dix dernières transactions */}
                        <div className='pt-5'>
                            
                            <div>
                                <TablesDesTransactions listeBudgets={listeBudgets} setListeBudgets={setListeBudgets}/>
                            </div>
                        </div>
                    </div>


                </div>

                <div className="drawer-side is-drawer-close:overflow-visible">
                    <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
                    <div className="flex min-h-full flex-col items-start bg-gray-200 is-drawer-close:w-14 is-drawer-open:w-64">

                        {/* logo */}
                        <div className="text-2xl p-5 ">
                            <button className="flex font-bold items-center justify-center gap-2 is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="BudgetApp">
                                {/* Home icon */}
                                <LuWallet className='text-slate-800 font-bold' />
                                <span className="is-drawer-close:hidden text-slate-500">Budget<span className='text-slate-800'>App</span></span>
                            </button>
                        </div>

                        {/* Sidebar content here */}
                        <ul className="menu w-full grow text-lg text-slate-800 font-semibold">
                            {/* List item */}
                            <li>
                                <Link href='/tableau-de-bord' className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="TableauDeBord">
                                    {/* Home icon */}
                                    <LuHouse />
                                    <span className="is-drawer-close:hidden">Tableau de bord</span>
                                </Link>
                            </li>

                            {/* List item */}
                            <li>
                                <Link href='/mes-budgets' className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Budgets">
                                    {/* Settings icon */}
                                    <LuWallet />
                                    <span className="is-drawer-close:hidden">Mes budgets</span>
                                </Link>
                            </li>

                            <li>
                                <Link href='/mes-transactions' className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Transactions">
                                    {/* Settings icon */}
                                    <LuSlidersHorizontal />
                                    <span className="is-drawer-close:hidden">Mes transactions</span>
                                </Link>
                            </li>
                        </ul>

                        {/* Bouton de deconnexion et de compte*/}
                        <div className='flex min-h-full flex-col p-4 gap-3 text-lg text-slate-800 font-semibold'>
                            <button className=" flex items-center gap-3 is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Transactions">
                                {/* Settings icon */}
                                <LuCircleUser />
                                <span className="is-drawer-close:hidden">Compte</span>
                            </button>

                            <button className="flex items-center gap-3 text-red-600 is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Transactions">
                                {/* Settings icon */}
                                <LuLogOut />
                                <span className="is-drawer-close:hidden">Déconnexion</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MesTransactions
