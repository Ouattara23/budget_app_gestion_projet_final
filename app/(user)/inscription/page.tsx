import Inscription from '@/components/inscription'
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Inscription",
    description: "Application de gestion de Budget",
};

function page() {
    return (
        <>
            <Inscription />
        </>
    )
}

export default page
