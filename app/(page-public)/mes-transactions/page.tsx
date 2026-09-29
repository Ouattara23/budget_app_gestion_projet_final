import Transactions from '@/components/Transactions'
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Mes transactions",
    description: "Application de gestion de Budget",
};


function page() {
  return (
    <>
      <Transactions/>
    </>
  )
}

export default page
