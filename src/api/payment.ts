import router from "@/api/configuration"

export const CreatePayment = async(amount: number) => {
    const { data } = await router.post('/payments/create_payment', { amount })
    return data;
}

export const GetPaymentsData = async(link: string) => {
    const { data } = await router.post("/payments/get_payment_data", { link })
    return data
}