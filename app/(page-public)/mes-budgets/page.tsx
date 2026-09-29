import SideBar2 from '@/components/sidebar2'
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Mes budgets",
    description: "Application de gestion de Budget",
};

function page() {
    return (
        <>
            {/* sidebar */}
            <SideBar2/>
        </>
    )
}

export default page
