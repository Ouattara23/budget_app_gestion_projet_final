"use client"

import MesTransactions from '@/components/MesTransactions'
import { BudgetType } from '@/types';
import { useState } from 'react';


function Transactions() {
    const [listeBudgets, setListeBudgets] = useState<BudgetType[]>([]);
    return (
        <>
            <MesTransactions listeBudgets={listeBudgets} setListeBudgets={setListeBudgets} />
        </>
    )
}

export default Transactions
