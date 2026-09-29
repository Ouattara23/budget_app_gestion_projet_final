"use client"
import React from 'react'

function ModalDepense() {
    return (
        <div>
            {/* ajout d'une nouvelle dépense */}
            <div>
                <button className="btn bg-indigo-500 text-white" onClick={() => document.getElementById('nouvelle_depense').showModal()}>Nouvelle Dépense</button>
                <dialog id="nouvelle_depense" className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-2xl mb-5 ">Nouvelle Dépense</h3>

                        <form className="space-y-2">
                            {/* Nom du budget */}
                            <div>
                                <label className="block mb-2 font-medium">
                                    Nom de la dépense
                                </label>
                                <input type="text" placeholder="Ex : Dépense" className="input w-full focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500" />
                            </div>

                            {/* Montant */}
                            <div>
                                <label className="block mb-2 font-medium">
                                    Montant (FCFA)
                                </label>
                                <input type="number" placeholder="100000" className="input input-bordered w-full focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500" />
                            </div>

                            {/* Date de dépense */}
                            <div>
                                <label className="block mb-2 font-medium">
                                    Date de dépense
                                </label>
                                <input type="date" className="input input-bordered w-full focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500" />
                            </div>

                            {/* Boutons */}
                            <div className="modal-action">
                                <div method="dialog">
                                    <button className="btn btn-outline">
                                        Annuler
                                    </button>
                                </div>

                                <button type="submit" className="btn bg-indigo-600 hover:bg-indigo-700 text-white border-none" >
                                    Enregistrer
                                </button>
                            </div>
                        </form>
                    </div>
                </dialog>
            </div>

        </div>
    )
}

export default ModalDepense
