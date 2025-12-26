"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { CreatePayment } from "@/api/payment";

type FormData = { amount: number };

export default function PaymentLinkPage() {
    const { register, handleSubmit } = useForm<FormData>();
    const [paymentData, setPaymentData] = useState<any>(null);

    const onSubmit = async (data: FormData) => {
        try {
            const result = await CreatePayment(data.amount);
            setPaymentData(result);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
                <input className="text-white placeholder:text-neutral-400" placeholder="Введите сумму" type="number" {...register("amount", { min: 1, required: true })} />
                <button type="submit" className="text-white py-2 px-4 bg-blue-500 rounded-lg cursor-pointer">
                    Сгенерировать
                </button>
            </form>

            {paymentData && (
                <div className="mt-4 text-white">
                    <p>Link: {paymentData.link}</p>
                </div>
            )}
        </div>
    );
}
