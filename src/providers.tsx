"use client";

import {
    isServer,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'

import { usePathname } from 'next/navigation';
import React, {
    createContext,
    useState,
    useEffect,
    useCallback,
    ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { verify } from '@/api/auth';
import { logout as logoutRequest } from '@/api/settings';

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    apiFetch: <T>(fn: () => Promise<T>) => Promise<T>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);


function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    const isPublicPayment = pathname.startsWith('/payments/');

    const checkAuth = useCallback(async (): Promise<boolean> => {
        try {
            const { status } = await verify();
            return status === 200;
        } catch (e: any) {
            const status = e?.response?.status;
            if (status === 404 || status === 401 || status === 403) return false;
            return false;
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await logoutRequest();
        } catch {}
        setIsAuthenticated(false);
        router.push('/auth');
        router.refresh();
    }, [router]);

    useEffect(() => {
        // 🔑 Платёжные страницы — публичные, не проверяем токен
        if (isPublicPayment) {
            setIsAuthenticated(false);
            setIsLoading(false);
            return;
        }

        const init = async () => {
            const ok = await checkAuth();
            setIsAuthenticated(ok);
            setIsLoading(false);
        };
        init();
    }, [checkAuth, isPublicPayment]);

    const apiFetch = useCallback(
        async <T,>(fn: () => Promise<T>): Promise<T> => {
            if (isPublicPayment) {
                return fn();
            }

            const ok = await checkAuth();
            if (!ok) {
                await logout();
                throw new Error('No active session');
            }

            try {
                const result = await fn();
                return result;
            } catch (e: any) {
                const status = e?.response?.status;

                if (status === 401 || status === 403) {
                    const againOk = await checkAuth();
                    if (!againOk) {
                        await logout();
                        throw new Error('Session expired');
                    }
                    const retryResult = await fn();
                    return retryResult;
                }

                throw e;
            }
        },
        [checkAuth, logout, isPublicPayment],
    );

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div>Checking authentication...</div>
            </div>
        );
    }

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                isLoading,
                apiFetch,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 300_000,
                refetchOnReconnect: false,
                refetchOnWindowFocus: false,
            },
        },
    });
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
    if (isServer) {
        return makeQueryClient();
    } else {
        if (!browserQueryClient) browserQueryClient = makeQueryClient()
        return browserQueryClient
    }
}

export function Providers({ children }: { children: React.ReactNode }) {
    const queryClient = getQueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>{children}</AuthProvider>
        </QueryClientProvider>
    );
}