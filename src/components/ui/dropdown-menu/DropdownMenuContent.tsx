"use client"

import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import { getProfile, logout } from '@/api/settings';

import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

import { ChevronDown, LogOut } from "lucide-react";
import MetaMaskLogo from "@/../public/assets/metamask-logo.svg"

export default function DropdownMenuContent() {
    const { data: profile } = useSuspenseQuery({
        queryKey: ['profile'],
        queryFn: getProfile,
    });

    const router = useRouter();
    const queryClient = useQueryClient();

    const handleLogout = async (e: React.MouseEvent) => {
        e.preventDefault();

        try {
            await logout();
            queryClient.clear();
            router.push('/auth');
            router.refresh();
        } catch (error) {
            console.error("Ошибка при выходе:", error);
        }
    };

    return (
        <div className="relative group">
            <button className="flex group px-3.5 h-11 gap-3 w-full justify-center items-center rounded-lg cursor-pointer bg-transparent hover:bg-neutral-800 transition-colors duration-200">
                <div className="relative inline-block shrink-0">
                    <div className="mask-[url(/assets/metamask-mask.svg)] size-7">
                        <Image src="/" alt="Avatar" width={28} height={28} className="aspect-square overflow-hidden size-7 shrink-0 rounded-full object-cover bg-white" />
                    </div>
                    <div className="absolute bottom-0 right-0">
                        <Image src={MetaMaskLogo} alt="MetaMask Logo" width={10} height={10} />
                    </div>
                </div>
                <span className="text-white font-medium pb-0.5">{profile?.name}</span>
                <ChevronDown strokeWidth={2.5} size={18} className="text-white group-hover:rotate-180 transition-transform duration-200 delay-100" />
            </button>

            <div className="absolute delay-100 right-0 top-full w-56 pt-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto">
                <div className="flex h-full w-full rounded-lg bg-neutral-900 border border-neutral-800">
                    <button onClick={handleLogout} className="flex w-full py-3 px-4 gap-3 bg-transparent items-center justify-start rounded-lg text-red-400 font-medium cursor-pointer hover:bg-neutral-800 transition-colors duration-200">
                        <LogOut strokeWidth={2.5} size={18} className="text-red-400" />
                        Logout
                    </button>
                </div>
            </div>
        </div>
    )
}