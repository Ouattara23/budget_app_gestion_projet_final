"use client";

import { useEffect, useState } from "react";
import { LuSquarePen, LuTrash2 } from "react-icons/lu";
import ModalBudget from "./modalbudget";
import { getAllDataTodatabase } from "@/lib/IndexDB/getAllDB";
import EditModalBudget from "./EditModalBudget";
import { DeleteToDB } from "@/lib/IndexDB/deleteToDB";
import { BudgetType } from "@/types";

function Cardbudget(item: any) {
    const [listeBudgets, setListeBudgets] = useState<BudgetType[]>([]);
    
    // Récupérer les budgets depuis IndexedDB
    useEffect(() => {
        if (typeof window === "undefined") return;

        getAllDataTodatabase("budgets", (data:any) => {
            console.log("Budgets récupérés :", data);
            setListeBudgets(data || []);
        });
    }, []);

    //On ouvre le modal pour modifier la tache
    const [todo, setToDo] = useState(null)
    const openModal = (item:any) => {
        setToDo(item)
        setTimeout(() => {
            document.getElementById("openEditModalBTN")?.click()
        }, 100);
    }

    //On supprime la tache
    const suprimeTache = (id: any) => {
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
    }


    return (
        <>
            {/* Modal ajout de budget */}
            <ModalBudget listeBudgets={listeBudgets} setListeBudgets={setListeBudgets} />

            {/* Grid des budgets */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-7 px-5 lg:px-20">

                {listeBudgets.length > 0 ? (
                    listeBudgets.map((budgets, index) => (
                        <div key={budgets.id || index + 1} className="card bg-white shadow-lg border border-gray-400" >
                            <div className="card-body">

                                <h2 className="card-title text-slate-700 font-bold text-xl flex justify-between">
                                    {budgets.nomBudget}
                                    <span className="font-bold text-green-600">
                                        {Number(budgets.montant).toLocaleString("fr-FR")} FCFA
                                    </span>
                                </h2>

                                {/*<p className="text-gray-500">
                                    Montant Aloué :{" "}
                                    
                                </p>*/}

                                <p className="text-gray-500">
                                    Montant restant : {" "}
                                </p>

                                <p className="text-gray-500">
                                    Mois : {" "}
                                    <span className="font-bold text-slate-600">
                                        {budgets.mois &&
                                            new Date(`${budgets.mois}-01`).toLocaleDateString("fr-FR", {
                                                month: "long",
                                                year: "numeric",
                                            })}
                                    </span>
                                </p>
                                <div className="card-actions justify-end mt-4">

                                    <button className="btn btn-sm bg-sky-900 text-white" onClick={() => openModal(budgets)} >
                                        <LuSquarePen />
                                        Modifier
                                    </button>

                                    <button className="btn btn-sm btn-error text-white" onClick={() => suprimeTache(budgets.id || index + 1)}>
                                        <LuTrash2 />
                                        Supprimer
                                    </button>

                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-10">
                        <p className="text-gray-500">
                            Aucun budget enregistré.
                        </p>
                    </div>
                )}

                <EditModalBudget item={todo} listeBudgets={listeBudgets} setListeBudgets={setListeBudgets} />

            </div>
        </>
    );
}

export default Cardbudget;