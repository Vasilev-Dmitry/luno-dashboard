"use server";

import { dehydrate, QueryClient } from "@tanstack/react-query";

export async function prefetchServerQuery<T>(
    queryKey: string | readonly string[],
    queryFn: () => Promise<T>,
    staleTime = 60_000
) {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { staleTime, retry: false },
        },
    });

    const keyArray = Array.isArray(queryKey) ? queryKey : [queryKey];

    await queryClient.prefetchQuery({ queryKey: keyArray, queryFn });
    return dehydrate(queryClient);
}