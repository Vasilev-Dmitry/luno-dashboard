"use client";

import { MetaMaskSDK } from "@metamask/sdk";

import { useEffect, useState, useRef } from "react";
import { postNonce, login } from "@/api/auth";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

import Metamask from "@/../public/assets/metamask-logo.svg";
import { ArrowRightIcon } from "lucide-react"

export default function ConnectWallet() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const sdk = useRef<MetaMaskSDK | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        sdk.current = new MetaMaskSDK({
            dappMetadata: {
                name: "Example JavaScript dapp",
                url: window.location.href,
            },
            infuraAPIKey: process.env.NEXT_PUBLIC_INFURA_API_KEY,
        })
    }, []);

    async function handleConnect() {
        if (!sdk.current) return;

        setIsLoading(true);

        try {
            const wallet = (await sdk.current?.connect())?.[0];
            if (!wallet) return;

            const { message } = await postNonce(wallet);

            const provider = sdk.current?.getProvider();
            if (!provider) return;

            const signature = await provider.request({
                method: 'personal_sign',
                params: [message, wallet],
            }) as string;

            await login(wallet, signature);

            const redirect = searchParams.get('redirect') || '/stores';
            router.push(redirect);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <button
            onClick={handleConnect}
            disabled={isLoading}
            className="flex group-hover justify-between items-center gap-3 cursor-pointer w-full my-6 py-3 group px-4 rounded-2xl hover:bg-neutral-800 disabled:pointer-events-none hover:translate-x-1 transition-all duration-200 ease-in-out"
        >
            <div className="flex items-center gap-3 text-white">
                <div className='bg-[#FFE9CC] rounded-full p-2'>
                    <Image src={Metamask} alt='logo' width={20} height={20} className="group-hover:animate-[shake_0.6s_ease-in-out]" />
                </div>
                {isLoading ? "Connecting..." : "Metamask"}
            </div>
            <ArrowRightIcon size={18} className='opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300 ease-out stroke-white' />
        </button>
    );
}