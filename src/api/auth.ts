import router from "@/api/configuration";

export const postNonce = async(wallet: string) => {
    const { data } = await router.post('/auth/nonce', { wallet });
    return data;
}

export const login = async(wallet: string, signature: string) => {
    const { data } = await router.post('/auth/login', { wallet, signature });
    return data;
}

export const verify = async() => {
    const { data } = await router.post('/auth/verify');
    return data;
}