"use client"

//import React, { useEffect, useState } from 'react'
import { LuChartColumnBig, LuCircleUser, LuHouse, LuLogOut, LuMenu, LuShoppingCart, LuSlidersHorizontal, LuUser, LuWallet } from 'react-icons/lu'
import Gestioncompte from './gestioncompte'
import Link from 'next/link'
//import { useRouter } from 'next/navigation'
//import TablesDesTransactions from './TablesDesTransactions'
import { BudgetType, UserType } from '@/types'
import { SetStateAction, useEffect, useState } from 'react'
import { getAllDataTodatabase } from '@/lib/IndexDB/getAllDB'
import ListesBudgets from './ListesBudgets'
import ListesDeMesTransactions from './ListesDeMesTransactions'
import recupererUser from './RecupererUser'

function SideBar({listeBudgets, setListeBudgets}:{listeBudgets: BudgetType[], setListeBudgets:React.Dispatch<SetStateAction<BudgetType[]>>}) {
    // les transactions
    //const [transactions, setTransactions] = useSate([])

    const [utilisateur, setUtilisateur] = useState<UserType | null>(null)
 
    useEffect(() => {
        getAllDataTodatabase("budgets", (data: any) => {
            console.log("Budgets récupérés :", data);
            setListeBudgets(data || []);
        });

        //utilisateur
        const user = recupererUser()

        setUtilisateur(user)

    }, [])


    return (
        <>
            {/* side barre */}
            <div className="drawer lg:drawer-open">
                <input id="my-drawer-4" type="checkbox" className="drawer-toggle inline" />
                <div className="drawer-content bg-white">
                    {/* Navbar */}
                    <nav className="navbar w-full bg-sky-900 text-lg text-white flex justify-between px-5">
                        <div className='flex items-center justify-center'>
                            <label htmlFor="my-drawer-4" aria-label="open sidebar" className="btn btn-square btn-ghost drawer-button">
                                {/* Sidebar toggle icon */}
                                <LuMenu className='text-xl text-white font-bold' />
                            </label>
                            <div className="px-4">Bienvenue <span className="font-bold">{utilisateur?.nom}</span></div>
                        </div>

                       {/* <div className="avatar">
                            <div className="w-15 rounded-full">
                                <img alt="Tailwind-CSS-Avatar-component" src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" />
                            </div>
                        </div>*/}

                        {/* compte */}
                        {/*<div>
                            <Gestioncompte />
                        </div>*/}
                    </nav>

                    {/* Page content here */}
                    <div className='px-5 lg:px-20 lg:p-5 mt-5'>
                        <div>
                            <h2 className='text-3xl font-bold text-slate-800 mb-5 lg:mb-15'>Tableau de bord</h2>
                        </div>

                        {/* différentes parties */}
                        <div className='bg-white shadow border border-gray-200 p-5 rounded-2xl mt-5 lg:mt-15'>
                            <div className=''>
                                <h3 className='text-rose-600 font-semibold text-lg'>Mes Dépenses</h3>
                            </div>

                            <div className='mt-5 lg:mt-10 grid grid-cols-1 lg:grid-cols-3 gap-4'>
                                <div className='shadow-lg shadow-indigo-200 border border-gray-200 rounded-2xl p-3 flex justify-between items-center'>
                                    <div className='space-y-3'>
                                        <h4 className='text-xl'>Revenue aloué</h4>
                                        <p className='font-bold text-indigo-400'>100 000 FCFA</p>
                                    </div>
                                    <LuWallet className="bg-indigo-200 text-indigo-900 h-15 w-15 p-4 rounded-full" />
                                </div>

                                <div className='shadow-lg shadow-green-200 border border-gray-200 rounded-2xl p-3 flex justify-between items-center'>
                                    <div className='space-y-3'>
                                        <h4 className='text-xl'>Budgets Mois</h4>
                                        <p className='font-bold text-green-400'>250 000 FCFA</p>
                                    </div>
                                    <LuShoppingCart className="bg-green-200 text-green-900 h-15 w-15 p-4 rounded-full flex items-center" />
                                </div>

                                <div className='shadow-lg shadow-violet-200 border border-gray-200 rounded-2xl p-3 flex justify-between items-center'>
                                    <div className='space-y-3'>
                                        <h4 className='text-xl'>Sortie du mois</h4>
                                        <p className='font-bold text-violet-400'>300 000 FCFA</p>
                                    </div>
                                    <LuChartColumnBig className="bg-violet-200 text-violet-900 h-15 w-15 p-4 rounded-full" />
                                </div>
                            </div>
                        </div>

                        {/* Mes transactions */}
                        <div className=' mt-5 lg:mt-15 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4'>
                                <div>
                                    {/*<h3 className='text-slate-700 font-semibold text-lg'>Mes transactions</h3>*/}
                                    {/*<div>
                                        <TablesDesTransactions listeBudgets={listeBudgets} setListeBudgets={setListeBudgets}/>
                                    </div>*/}

                                    <ListesDeMesTransactions/>
                            </div>

                            {/* liste des budgets */}
                            <div>
                                <div>
                                    <ListesBudgets/>
                                </div>
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
                        <div className='flex min-h-full flex-col p-4 gap-3 text-lg font-semibold'>
                            <button className=" flex items-center text-slate-900 gap-3 is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Transactions">
                                {/* Settings icon */}
                                <LuCircleUser />
                                <span className="is-drawer-close:hidden">Compte</span>
                            </button>

                            <button className="flex items-center text-red-600 gap-3 is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Transactions">
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

export default SideBar
