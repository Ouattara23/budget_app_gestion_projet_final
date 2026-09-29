import Connexion from '@/components/connexion'
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Connexion",
    description: "Application de gestion de Budget",
};

function page() {
    return (
        <>
            <Connexion/>
        </>
    )
}

export default page
