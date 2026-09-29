import DashBord from '@/components/DashBord'
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Connexion",
    description: "Application de gestion de Budget",
};

function page() {
  return (
    <>
      <DashBord/>  
    </>
  )
}

export default page
