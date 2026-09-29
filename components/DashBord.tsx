"use client"

import { useState } from 'react';
//import React from 'react'
import SideBar from './sidebar'
import { BudgetType, TransactionType } from '@/types';

function DashBord() {
    const [listeBudgets, setListeBudgets] = useState<BudgetType[]>([]);
    const [listeTransactions, setListeTransactions] = useState<TransactionType[]>([]);

    return (
        <>
            <SideBar listeBudgets={listeBudgets} setListeBudgets={setListeBudgets}/>
        </>
    )
}

export default DashBord
