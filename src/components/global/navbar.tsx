"use server";

import { prefetchServerQuery } from "@/api/hooks/prefetchServerQuery";
import { HydrationBoundary } from "@tanstack/react-query";
import { getProfile } from "@/api/settings";
import DropdownMenuComponent from "@/components/ui/dropdown-menu/DropdownMenuComponent";

export default async function Navbar() {
    const dehydratedState = await prefetchServerQuery(
        ["profile"],
        getProfile,
    );

    return (
        <HydrationBoundary state={dehydratedState}>
            <nav className="flex items-center justify-between w-full px-5 pt-3">
                <input />
                <div className="flex gap-2 items-center">
                    <div className="w-px h-8 bg-neutral-800 rounded-full" />
                    <DropdownMenuComponent />
                </div>
            </nav>
        </HydrationBoundary>
    );
}