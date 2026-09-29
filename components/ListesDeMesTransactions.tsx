"use client";

import { useEffect, useState } from "react";

import EditModalBudget from "./EditModalBudget";

import { getAllDataTodatabase } from "@/lib/IndexDB/getAllDB";

import { BudgetType, TransactionType } from "@/types";

function ListesDeMesTransactions() {

    const [listeTransactions, setListeTransactions] = useState<TransactionType[]>([]);
    const [listeBudgets, setListeBudgets] = useState<BudgetType[]>([]);

    const [todo, setToDo] = useState<any>(null);

    // Garder uniquement les 3 dernières transactions 
    const troisDernieresTransactions = listeTransactions .slice(-5) .reverse();
        const formatDate = (date: string) => {
        const d = new Date(date);

        const heure = d.getHours().toString().padStart(2, "0");
        const minutes = d.getMinutes().toString().padStart(2, "0");

        const mois = (d.getMonth() + 1).toString().padStart(2, "0");
        const jour = d.getDate().toString().padStart(2, "0");
        const annee = d.getFullYear();

        return `${heure}h${minutes} ${mois}/${jour}/${annee}`;
    };

    // Récupérer les transactions ET les budgets
    useEffect(() => {

        if (typeof window === "undefined") return;

        // Transactions
        getAllDataTodatabase("transactions", (data: TransactionType[]) => {
            console.log("Transactions récupérées :", data);
            setListeTransactions(data || []);
        });

        // Budgets
        getAllDataTodatabase("budgets", (data: BudgetType[]) => {
            console.log("Budgets récupérés :", data);
            setListeBudgets(data || []);
        });

    }, []);

    return (
        <>
            <div>
                <div className="py-3 font-bold text-sky-800">
                    <h4>Mes dernières transactions</h4>
                </div>

                {listeTransactions.length > 0 ? (

                    <div className="overflow-x-auto rounded-lg shadow">

                        <table className="w-full text-sm text-left text-gray-600">

                            <thead className="text-xs text-white uppercase bg-sky-900">

                                <tr>

                                    <th scope="col" className="px-6 py-4">
                                        Date et Heure
                                    </th>

                                    <th scope="col" className="px-6 py-4 text-center">
                                        Objectif
                                    </th>

                                    <th scope="col" className="px-6 py-4 text-center">
                                        Budget
                                    </th>

                                    <th scope="col" className="px-6 py-4 text-center">
                                        Montant
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {troisDernieresTransactions.map((transaction, index) => {

                                    const budget = listeBudgets.find(
                                        (budget) =>
                                            budget.id === Number(transaction.budgetId)
                                    );

                                    return (
                                        <tr key={transaction.id || index} className="bg-white border-t border-t-gray-300 hover:bg-gray-50" >

                                            <td className="px-4 py-2 font-semibold text-slate-700">
                                                {formatDate(transaction.date)}
                                            </td>

                                            <td className="px-4 py-2 font-semibold text-slate-700 text-center">
                                                {transaction.objectif}
                                            </td>

                                            <td className="px-4 py-2 font-semibold text-slate-700 text-center">
                                                {budget?.nomBudget || "Budget inconnu"}
                                            </td>

                                            <td className="px-4 py-2 font-medium text-center">
                                                {transaction.montant.toLocaleString("fr-FR")} FCFA
                                            </td>

                                        </tr>
                                    );

                                })}

                            </tbody>

                        </table>

                    </div>

                ) : (

                    <div className="text-center py-10">

                        <p className="text-gray-500">
                            Aucune transaction enregistrée.
                        </p>

                    </div>

                )}

                {/*<EditModalBudget item={todo} listeBudgets={listeBudgets} setListeBudgets={setListeBudgets} />*/}

            </div>
        </>
    );
}

export default ListesDeMesTransactions;