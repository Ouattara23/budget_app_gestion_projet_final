"use client"

import { useEffect, useRef } from "react"

type Props = {
    open: boolean
    onClose: () => void
    titre: string
    children: React.ReactNode
}

// Modale basée sur <dialog> natif : Échap et clic à l'extérieur ferment la fenêtre
export default function Modal({ open, onClose, titre, children }: Props) {
    const ref = useRef<HTMLDialogElement>(null)

    useEffect(() => {
        const dialog = ref.current
        if (!dialog) return
        if (open && !dialog.open) dialog.showModal()
        if (!open && dialog.open) dialog.close()
    }, [open])

    return (
        <dialog ref={ref} className="modal" onClose={onClose}>
            <div className="modal-box bg-white">
                <h3 className="font-bold text-xl text-sky-900 mb-4">{titre}</h3>
                {children}
            </div>
            <form method="dialog" className="modal-backdrop">
                <button aria-label="Fermer">fermer</button>
            </form>
        </dialog>
    )
}
