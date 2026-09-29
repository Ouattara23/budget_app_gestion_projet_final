let dabase;  //variable pour manipuler la base de données

export const OpenDataBase = (callback) => {

    //Testons si on est pas sur un navigateur
    if(typeof window === "undefined") {
        callback(null)
        return;
    }


    // si la DB est déjà ouverte, on appelle immédiatement le callback
    if (dabase) {
        callback(dabase)
        return
    }
    
    const req = indexedDB.open("BudgetDB", 5)

    //On créé les tables
    req.onupgradeneeded = (e) => {  
        dabase = e.target.result 

        //Table users
         if (!dabase.objectStoreNames.contains("users")) {
            const store = dabase.createObjectStore("users", {
                keyPath: "id",
                autoIncrement: true 
            })
            //Creons des index de recherche
            store.createIndex("nom", "nom", {
                unique: false 
            })
            store.createIndex("email", "email", {
                unique: false 
            })
        }

        //Table budgets
         if (!dabase.objectStoreNames.contains("budgets")) {
            const store = dabase.createObjectStore("budgets", {
                keyPath: "id",
                autoIncrement: true
            })
        }

        //Table dépense
         if (!dabase.objectStoreNames.contains("transactions")) {
            const store = dabase.createObjectStore("transactions", {
                keyPath: "id",
                autoIncrement: true
            })
        }
    }
    //On verifie que tous c'est bien passé
    req.onsuccess = (e) => {
        dabase = e.target.result
        callback(dabase)
    }

    req.onerror = (e) => {
        console.error('Erreur de connexion à la db', e)
        callback(null)
    }
}
