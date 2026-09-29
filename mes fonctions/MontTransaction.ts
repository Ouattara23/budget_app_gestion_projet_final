import { TransactionType } from "@/types";

export const MontTransaction = ( listeTransactions: TransactionType[], budgetId: string, montant: number | string ) => {

    // Transactions appartenant au budget
    /*const transactionsDuBudget = listeTransactions.filter(
        (transaction) => transaction.budgetId === budgetId
    );*/

    const transactionsDuBudget = (listeTransactions || []).filter(( transaction => transaction.budgetId === String(budgetId)));

    // Total des transactions
    const totalTransactions = (transactionsDuBudget.reduce( (total, transaction) => { return total + Number(transaction.montant); }, 0 ));

    // Montant restant
    const budgetRestant = Number(montant) - totalTransactions;

    return budgetRestant;
};