"use client"

import { SetStateAction, useEffect, useState } from "react";
import { BudgetType, TransactionType } from "../types"
import BtnAjoutTransactions from "./BtnAjoutTransactions";
import { getAllDataTodatabase } from "@/lib/IndexDB/getAllDB";
import { DeleteToDB } from "@/lib/IndexDB/deleteToDB";
import { LuPen, LuTrash2 } from "react-icons/lu";
import EditModalTransaction from "./EditModalTransaction";
import { MontTransaction } from "@/mes fonctions/MontTransaction";

function TablesDesTransactions({ listeBudgets, setListeBudgets }: { listeBudgets: BudgetType[], setListeBudgets: React.Dispatch<SetStateAction<BudgetType[]>> }) {

    const [listeTransactions, setListeTransactions] = useState<TransactionType[]>([]);
    //const [budgetId, setBudgetId] = useState<string>("");
    //const [listeBudgets, setListeBudgets] = useState<BudgetType[]>([]);

    const formatDate = (date: string) => {
        const d = new Date(date);

        const heure = d.getHours().toString().padStart(2, "0");
        const minutes = d.getMinutes().toString().padStart(2, "0");

        const mois = (d.getMonth() + 1).toString().padStart(2, "0");
        const jour = d.getDate().toString().padStart(2, "0");
        const annee = d.getFullYear();

        return `${heure}h${minutes} : ${mois}/${jour}/${annee}`;
    };

    // Récupérer les budgets depuis IndexedDB
    useEffect(() => {
        if (typeof window === "undefined") return;

        getAllDataTodatabase("transactions", (data: any) => {
            console.log("Transactions récupérés :", data);
            setListeTransactions(data || []);
        });
    }, []);

    //On ouvre le modal pour modifier la tache
    const [todo, setToDo] = useState(null)
    const openModal = (item: any) => {
        setToDo(item)
        setTimeout(() => {
            document.getElementById("openEditModalBTN")?.click()
        }, 100);
    }

    //On supprime la tache
    const suprimeTransaction = (id: any) => {
        if (confirm("Voulez-vous supprimer cette transaction ?")) {
            DeleteToDB("transactions", id, (e: any) => {
                if (!e) {
                    alert("Transaction non supprimé. une erreur s'est produite")
                    return;
                }

                //On retire la tache du tableau js (html)
                const nouveauTableau = listeTransactions.filter(item =>
                    item.id !== id
                )

                setListeTransactions(nouveauTableau);
            })
        }
    }


    return (
        <>
            <div>
                {/* formulaire pour enregistrer des transaction */}
                <BtnAjoutTransactions listeBudgets={listeBudgets} setListeBudgets={setListeBudgets} />

                <div className='mt-5'>
                    {listeTransactions.length > 0 ? (
                        <div className="overflow-x-auto rounded-lg shadow">
                            <table className="w-full text-sm text-left text-gray-600">
                                {/* head */}
                                <thead className="text-xs text-white uppercase bg-sky-900">
                                    <tr>
                                        <th scope="col" className="px-6 py-4">Date et Heure</th>
                                        <th scope="col" className="px-6 py-4">Objectif</th>
                                        <th scope="col" className="px-6 py-4">Budgets</th>
                                        <th scope="col" className="px-6 py-4">Montant</th>
                                        <th scope="col" className="px-6 py-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* row 1 */}
                                    {listeTransactions.map((transaction) => (

                                        <tr key={transaction.id} className="bg-white border-t border-t-gray-300 hover:bg-gray-50" >

                                            <td className="px-4 py-3">
                                                {formatDate(transaction.date)}
                                            </td>

                                            <td className="px-4 py-3">
                                                {transaction.objectif}
                                            </td>

                                            <td className="px-4 py-3">
                                                

                                                {
                                                    listeBudgets.find(
                                                        (budgets) => budgets.id === Number(transaction.budgetId)
                                                    )?.nomBudget
                                                }
                                            </td>

                                            <td className="px-4 py-3 font-medium">
                                                {MontTransaction(listeTransactions, transaction.montant.toLocaleString("fr-FR"))} FCFA
                                            </td>

                                            <td className="px-4 py-3">
                                                <button className="mr-2 bg-sky-800 text-white p-2" onClick={() => openModal(transaction)}>
                                                    <LuPen />
                                                </button>

                                                <button className="bg-red-400 text-white p-2" onClick={() => suprimeTransaction(transaction.id)}>
                                                    <LuTrash2 />
                                                </button>
                                            </td>

                                        </tr>

                                    ))}

                                </tbody>
                            </table>
                        </div>

                    ) : (
                        <div className="col-span-full text-center py-10">
                            <p className="text-gray-500">
                                Aucune transaction enregistré.
                            </p>
                        </div>
                    )}
                    <EditModalTransaction item={todo} listeBudgets={listeBudgets} setListeBudgets={setListeBudgets} />

                </div>
            </div>
        </>
    )
}

export default TablesDesTransactions
