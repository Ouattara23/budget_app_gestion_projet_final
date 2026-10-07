"use client"

import { useCallback, useState } from "react"

type ToastState = { message: string; type: "success" | "error" } | null

// Remplace les alert() : petite notification qui disparaît seule
export function useToast() {
    const [toast, setToast] = useState<ToastState>(null)

    const afficher = useCallback((message: string, type: "success" | "error" = "success") => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3500)
    }, [])

    const ToastView = toast ? (
        <div className="toast toast-top toast-end z-50">
            <div role="status" className={`alert ${toast.type === "success" ? "alert-success" : "alert-error"} text-white shadow-lg`}>
                <span>{toast.message}</span>
            </div>
        </div>
    ) : null

    return { afficher, ToastView }
}
