'use client';

import {useGetProfile} from '@/api/hooks/useSettings';
import { logout } from "@/api/settings";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import RenameForm from "@/components/dashboard/settings/RenameForm";

export default function Settings() {
    const { data: profile, isLoading } = useGetProfile();

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

    if (isLoading) return <p>Загрузка...</p>;
    if (!profile) return <p>Нет данных</p>;

    return (
        <div>
            <p className="text-white">Name: {profile.name}</p>
            <p className="text-white">Wallet: {profile.wallet}</p>

            <RenameForm />

            <button onClick={handleLogout} className="text-white py-2 px-4 bg-blue-500 rounded-lg cursor-pointer">
                Выйти
            </button>
        </div>
    );
}
