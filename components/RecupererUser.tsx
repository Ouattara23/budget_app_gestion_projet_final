import { UserType } from "@/types"

export const recupererUser = (): UserType | null => {
    const user = localStorage.getItem("user")

    if (!user) {
        return null
    }

    return JSON.parse(user) as UserType
}

export default recupererUser