import { OpenDataBase } from "./IndexDB/createdb";

export const LoginUser = (email, password, callback) => {
    OpenDataBase((db) => {

        if (!db) {
            callback(null);
            return;
        }

        const transaction = db.transaction("users", "readonly");
        const store = transaction.objectStore("users");

        const request = store.getAll();

        request.onsuccess = () => {
            const users = request.result;

            const user = users.find(
                (user) =>
                    user.email === email &&
                    user.password === password
            );

            if (user) {
                callback(user);
            } else {
                callback(null);
            }
        };

        request.onerror = () => {
            callback(null);
        };
    });
};