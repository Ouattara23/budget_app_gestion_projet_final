"use client";

import { InitAuth } from "@/fireBaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function AuthProviderFirebase({
  children,
}: {
  children: React.ReactNode;
}) {
  const [load, setLoad] = useState(true);
  const [user, setUser] = useState<any>(null);

  const route = useRouter();

  useEffect(() => {
    const connexion = onAuthStateChanged(InitAuth, (data) => {
      if (data) {
        // Utilisateur connecté
        setUser(data);
        setLoad(false);
      } else {
        // Utilisateur non connecté
        setUser(null);
        setLoad(false);
        route.replace("/connexion");
      }
    });

    return () => connexion();
  }, [route]);

  // Pendant que Firebase vérifie la session
  if (load) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  // Si aucun utilisateur n'est connecté
  if (!user) {
    return null;
  }

  // Utilisateur connecté
  return <>{children}</>;
}

export default AuthProviderFirebase;
