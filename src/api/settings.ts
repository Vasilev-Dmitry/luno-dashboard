import router from "@/api/configuration"

export const getProfile = async() => {
    const { data } = await router.get('/profile/info')
    return data;
}

export const logout = async() => {
    await router.post("/profile/logout")
}

export const Rename = async(name: string) => {
    const { data } = await router.patch("/profile/rename", {name})
    return data;
}