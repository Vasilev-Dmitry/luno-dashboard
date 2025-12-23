'use client';

import {useGetProfile} from '@/api/hooks/useSettings';
import { Logout } from "@/api/settings";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import RenameForm from "@/components/dashboard/Settings/RenameForm";

export default function Settings() {
    const { data: profile, isLoading } = useGetProfile();

    const router = useRouter();
    const queryClient = useQueryClient();

    const handleLogout = async (e: React.MouseEvent) => {
        e.preventDefault();

        try {
            await Logout();
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
            <p className="text-white">Email: {profile.email}</p>
            <p className="text-white">Wallet: {profile.wallet}</p>

            <RenameForm />

            <button onClick={handleLogout} className="text-white">
                Выйти
            </button>
        </div>
    );
}
