'use client';

import React, { useState } from 'react';
import { ethers } from "ethers";
import { postNonce, login } from "@/api/auth";
import { useRouter, useSearchParams } from 'next/navigation';
import Image from "next/image";
import Metamask from '@/../public/assets/metamask-logo.svg';
import Google from '@/../public/assets/google-logo.svg';
import Logo from '@/../public/assets/logo.svg';
import Link from "next/link";

export default function ConnectWallet() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleConnect() {
        setIsLoading(true);
        setError(null);

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);

            await provider.send("eth_requestAccounts", []);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();

            const nonceResponse = await postNonce(address);
            const nonce = nonceResponse.nonce;

            const signature = await signer.signMessage(nonce);

            await login(address, signature);

            const redirect = searchParams.get('redirect') || '/stores';
            router.push(redirect);

        } catch (err) {
            setError("Ошибка входа: Не удалось подключить кошелек или подписать сообщение.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-center justify-between min-h-screen">
            <nav className="flex w-full px-16 py-5 items-center gap-3">
                <Image src={Logo} alt="logo" />
                <span className="text-white font-medium text-2xl">Luno</span>
            </nav>
            <div className="flex flex-col w-full max-w-[380px] gap-8">
                <h1 className="text-center text-2xl text-white font-semibold leading-tight">Welcome to Luno,<br /><span className="text-[#A8A8A8]">Smart crypto payment.</span></h1>

                <div className="space-y-5">
                    <div className="space-y-3">
                        <button className="flex items-center rounded-full bg-white cursor-pointer w-full px-6 py-4 hover:bg-neutral-50 disabled:pointer-events-none">
                            <div className="flex items-center gap-4 font-medium">
                                <Image src={Google} alt='logo' width={20} height={20} />
                                Continue with Google
                            </div>
                        </button>

                        <button
                            onClick={handleConnect}
                            disabled={isLoading}
                            className="flex items-center rounded-full bg-white cursor-pointer w-full px-6 py-4 hover:bg-neutral-50 disabled:pointer-events-none"
                        >
                            <div className="flex items-center gap-4 font-medium">
                                <Image src={Metamask} alt='logo' width={20} height={20} />
                                {isLoading ? "Connecting..." : "Continue with MetaMask"}
                            </div>
                        </button>
                    </div>

                    <div className='flex w-full items-center'>
                        <div className="h-[1px] rounded-full bg-[#2B2B2B] w-full" />
                        <span className="text-[#A8A8A8] px-4 font-medium text-sm">OR</span>
                        <div className="h-[1px] rounded-full bg-[#2B2B2B] w-full" />
                    </div>

                    <div className="space-y-3">
                        <input className="flex items-center rounded-full bg-[#2B2B2B] w-full px-6 py-4 placeholder:text-[#A8A8A8] placeholder:font-medium text-white font-medium" placeholder="Enter your work email..."/>

                        <button className="flex items-center rounded-full bg-[#2B2B2B] cursor-pointer w-full px-6 py-4 disabled:pointer-events-none">
                                <div className="flex w-full items-center justify-center gap-4 font-medium text-white">
                                    Continue
                                </div>
                        </button>
                    </div>
                </div>
            </div>

            <div className='flex w-full max-w-[360px] items-center justify-between py-5'>
                <span className="text-[#A8A8A8] font-medium">© 2025 Luno</span>

                <div className="flex gap-3 items-center">
                    <Link href="/" className="text-[#A8A8A8] font-medium">Privacy</Link>
                    <div className='h-[3px] w-[3px] rounded-full bg-[#A8A8A8]' />
                    <Link href="/" className="text-[#A8A8A8] font-medium">Terms</Link>
                </div>
            </div>
        </div>
    );
}
