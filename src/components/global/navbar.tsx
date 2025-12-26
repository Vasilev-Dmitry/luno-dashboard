"use client";

import { ChevronDown } from 'lucide-react';
import { useGetProfile } from '@/api/hooks/useSettings';
import Image from "next/image";
import MetaMaskLogo from "@/../public/assets/metamask-logo.svg"

export default function Navbar() {
    const { data: profile, isLoading } = useGetProfile();

    return (
        <nav className="flex items-center justify-between w-full px-5 pt-3">
            <button className="flex items-center gap-2 group pl-3 pr-4 py-1 rounded-lg cursor-pointer hover:bg-neutral-800 transition-all duration-200">
                <div className="p-1">
                    <Image
                        src={"/"}
                        alt="Avatar"
                        width={40}
                        height={40}
                        className="h-8 w-8 bg-neutral-200 rounded-full"
                    />
                </div>
                {!isLoading && profile?.name && (
                    <span className="text-white font-medium pb-1">{profile.name}</span>
                )}
                <ChevronDown strokeWidth={2.5} size={18} className='text-white group-hover:rotate-180 transition-transform ease-in-out duration-75 delay-300' />
            </button>
            <div className="flex gap-2 items-center">
                <div className="w-px h-8 bg-neutral-800 rounded-full" />
                <button className="flex items-center gap-2 group pl-3 pr-4 py-1 rounded-lg cursor-pointer hover:bg-neutral-800 transition-colors duration-200">
                    <div className="relative p-1">
                        <Image
                            src={"/"}
                            alt="Avatar"
                            width={40}
                            height={40}
                            className="h-8 w-8 bg-neutral-200 rounded-full"
                        />
                        <div className="absolute bottom-0 right-0 p-0.5 bg-neutral-900 rounded-lg border-4 border-black group-hover:border-neutral-800 transition-colors duration-200">
                            <Image src={MetaMaskLogo} alt='MetaMask Logo' height={10} width={10} />
                        </div>
                    </div>
                    {!isLoading && profile?.name && (
                        <span className="text-white font-medium pb-1">{profile.name}</span>
                    )}
                    <ChevronDown strokeWidth={2.5} size={18} className='text-white group-hover:rotate-180 transition-transform duration-75 delay-200' />
                </button>
            </div>
        </nav>
    );
}