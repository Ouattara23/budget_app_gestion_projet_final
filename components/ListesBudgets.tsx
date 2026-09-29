"use client";

import { useEffect, useState } from "react";
import { LuSquarePen, LuTrash2 } from "react-icons/lu";
import ModalBudget from "./modalbudget";
import { getAllDataTodatabase } from "@/lib/IndexDB/getAllDB";
import EditModalBudget from "./EditModalBudget";
import { DeleteToDB } from "@/lib/IndexDB/deleteToDB";

function ListesBudgets(item: any) {
    const [listeBudgets, setListeBudgets] = useState([]);

    // Récupérer les budgets depuis IndexedDB
    useEffect(() => {
        if (typeof window === "undefined") return;

        getAllDataTodatabase("budgets", (data: any) => {
            console.log("Budgets récupérés :", data);
            setListeBudgets(data || []);
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
    /*const suprimeTache = (id: any) => {
        if (confirm("Voulez-vous supprimer cet budget ?")) {
            DeleteToDB("budgets", id, (e: any) => {
                if (!e) {
                    alert("Budgets non supprimé. une erreur s'est produite")
                    return;
                }

                //On retire la tache du tableau js (html)
                const nouveauTableau = listeBudgets.filter(item =>
                    item.id !== id
                )

                setListeBudgets(nouveauTableau);
            })
        }
    }*/

    // Garder uniquement les 3 dernières transactions 
    const troisDerniersBudgets = listeBudgets .slice(-5) .reverse();


    return (
        <>
            {/* Modal ajout de budget */}
            {/*<ModalBudget listeBudgets={listeBudgets} setListeBudgets={setListeBudgets} />*/}

            {/* Grid des budgets */}
            {/* Tableau des budgets */}
            <div className="py-3 font-bold text-sky-800">
                <h4>Mes derniers budgets</h4>
            </div>

            <div className="">
                {listeBudgets.length > 0 ? (
                    <div className="overflow-x-auto rounded-lg shadow">
                        <table className="w-full text-sm text-left text-gray-600">
                            <thead className="text-xs text-white uppercase bg-sky-900">
                                <tr>
                                    {/*<th scope="col" className="px-6 py-4">
                                        #
                                    </th>*/}

                                    <th scope="col" className="px-6 py-4">
                                        Budget
                                    </th>

                                    <th scope="col" className="px-6 py-4 text-center">
                                        Montant
                                    </th>

                                    <th scope="col" className="px-6 py-4 text-center">
                                        Mois
                                    </th>
                                    

                                    {/*<th scope="col" className="px-6 py-4 text-center">
                                        Actions
                                    </th>*/}
                                </tr>
                            </thead>

                            <tbody>
                                {troisDerniersBudgets.map((budget: any, index: number) => (
                                    <tr key={budget.id || index} className="bg-white border-t border-t-gray-300 hover:bg-gray-50" >
                                        {/* Numéro */}
                                        {/*<td className="px-6 py-4 font-medium">
                                            {index + 1}
                                        </td>*/}

                                        {/* Nom du budget */}
                                        <td className="px-4 py-2 font-semibold text-slate-700">
                                            {budget.nomBudget}
                                        </td>

                                        {/* Montant */}
                                        <td className="px-4 py-2 font-bold text-slate-700 text-center">
                                            {Number(budget.montant).toLocaleString("fr-FR")} FCFA
                                        </td>

                                        {/* Mois */}
                                        <td className="px-4 py-2 text-center">
                                            {budget.mois &&
                                                new Date(`${budget.mois}-01`).toLocaleDateString(
                                                    "fr-FR",
                                                    {
                                                        month: "long",
                                                        year: "numeric",
                                                    }
                                                )}
                                        </td>

                                        {/* Actions */}
                                        {/*<td className="px-4 py-2">
                                            <div className="flex justify-center gap-2">
                                                <button className="btn btn-sm bg-sky-900 text-white" onClick={() => openModal(budget)} >
                                                    <LuSquarePen />
                                                </button>

                                                <button className="btn btn-sm btn-error text-white" onClick={() => suprimeTache( budget.id || index +  1) } >
                                                    <LuTrash2 />
                                                </button>
                                            </div>
                                        </td>*/}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <p className="text-gray-500">
                            Aucun budget enregistré.
                        </p>
                    </div>
                )}

                <EditModalBudget
                    item={todo}
                    listeBudgets={listeBudgets}
                    setListeBudgets={setListeBudgets}
                />
            </div>
        </>
    );
}

export default ListesBudgets;