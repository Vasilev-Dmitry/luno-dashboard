'use client';

import { IconSelector } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { useGetProfile } from '@/api/hooks/useSettings';
import Image from "next/image";
import Link from "next/link";
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const { data: profile, isLoading } = useGetProfile();
    const pathname = usePathname();

    const getActiveTabFromPath = (path: string) => {
        if (path.startsWith('/stores')) return 'stores';
        if (path.startsWith('/analytics')) return 'analytics';
        if (path.startsWith('/settings')) return 'settings';
        return 'stores';
    };

    const [activeTab, setActiveTab] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('activeTab');
            return saved || getActiveTabFromPath(pathname);
        }
        return getActiveTabFromPath(pathname);
    });

    useEffect(() => {
        const tabFromPath = getActiveTabFromPath(pathname);
        setActiveTab(tabFromPath);
        localStorage.setItem('activeTab', tabFromPath);
    }, [pathname]);

    const handleTabClick = (tabId: string) => {
        setActiveTab(tabId);
        localStorage.setItem('activeTab', tabId);
    };

    const tabs = [
        { id: 'stores', label: 'Stores', href: '/stores' },
        { id: 'analytics', label: 'Analytics', href: '/analytics' },
        { id: 'settings', label: 'Settings', href: '/settings' },
    ];

    return (
        <nav className="flex flex-col w-full px-5 pt-4 gap-2 border-neutral-900 border-b-1">
            <div className="flex items-center justify-between">
                <div className="flex gap-4 items-center cursor-pointer">
                    <Image
                        src={"/"}
                        alt="Avatar"
                        width={40}
                        height={40}
                        className="h-10 w-10 bg-neutral-200 rounded-full"
                    />

                    {!isLoading && profile?.name && (
                        <span className="text-white font-medium leading-tight">
                            {profile.name}
                        </span>
                    )}

                    <button className="flex cursor-pointer items-center justify-center bg-transparent h-10 px-1.5 hover:bg-neutral-950 transition-colors duration-200 rounded-xl">
                        <IconSelector size={20} className='text-neutral-500'/>
                    </button>
                </div>
                <div className="flex gap-4 items-center cursor-pointer">
                    <button className="flex items-center bg-white rounded-full h-10 px-4 font-medium cursor-pointer">
                        Create Link
                    </button>
                    <Image
                        src={"/"}
                        alt="Avatar"
                        width={40}
                        height={40}
                        className="h-10 w-10 bg-neutral-200 rounded-full"
                    />
                </div>
            </div>
            <div className="flex items-center gap-4">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <Link
                            key={tab.href}
                            onClick={() => handleTabClick(tab.id)}
                            href={tab.href}
                            className={`flex font-medium leading-tight items-center justify-center h-full px-2 py-4
                                ${isActive ? 'text-white border-b-2 border-white' : 'text-[#A8A8A8] border-b-2 border-transparent'}`}
                        >
                            {tab.label}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}