'use client';

import { Suspense } from 'react';
import DropdownMenuContent from '@/components/ui/dropdown-menu/DropdownMenuContent';
import DropdownMenuSkeleton from '@/components/ui/dropdown-menu/DropdownMenuSkeleton';

export default function DropdownMenuComponent() {
    return (
        <Suspense fallback={<DropdownMenuSkeleton />}>
            <DropdownMenuContent />
        </Suspense>
    );
}