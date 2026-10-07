"use client"

import { InitAuth } from '@/fireBaseConfig'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { useRouter } from 'next/navigation'

function GoogleAuthBtn() {

    const route = useRouter() //pour rediriger sur d'autres page via js avec nextjs

    const googleConnect = async () => {
        try {
            //on appel le provider(fournisseur ou methode de connexion)
            const provider = new GoogleAuthProvider()

            //on se connecte maintenant via google
            const data = await signInWithPopup(InitAuth, provider)

            if (!data?.user) {
                alert("Impossible de se connecter à votre compte google. reessayer ou verifier connexion")
                return;
            }
            //on recupere les infos de connexion
            const user = data?.user

            if (typeof window !== "undefined") localStorage.setItem("user", JSON.stringify({
                id: user.uid,
                nom: user.displayName
            }))

            //on le redirige sur le back office
            route.push("/tableau-de-bord")

        } catch (error: any) {
            const messageErr = error.message
            console.log(messageErr)
            alert("Une erreur s'est produite pendant la connexion à google")
        }
    }

    return (
        <>
            <button type="button" onClick={googleConnect} className="btn bg-white text-black border-[#e5e5e5]">
                <svg aria-label="Google logo" width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
                Continuer avec Google
            </button>
        </>
    )
}

export default GoogleAuthBtn
