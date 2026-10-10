"use client";

import { getFirebaseAuth } from "@/fireBaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

function AuthProviderFirebase({ children }: { children: React.ReactNode }) {
  const [load, setLoad] = useState(true);
  const [user, setUser] = useState<any>(null);
  const route = useRouter();
  const pathname = usePathname();
  const pathnameActuel = useRef(pathname);
  pathnameActuel.current = pathname;

  useEffect(() => {
    const connexion = onAuthStateChanged(getFirebaseAuth(), (data) => {
      if (data) {
        setUser(data);
        setLoad(false);
      } else {
        setUser(null);
        setLoad(false);
        if (pathnameActuel.current !== "/") route.replace("/connexion");
      }
    });

    return () => connexion();
  }, [route]);

  // La page d’accueil reste consultable sans compte.
  if (pathname === "/") return <>{children}</>;

  if (load) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <span className="loading loading-spinner loading-xl" aria-label="Chargement" />
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}

export default AuthProviderFirebase;
