"use client";

import { MetaMaskSDK } from "@metamask/sdk";
import { useGetPaymentsData } from '@/api/hooks/usePayment';
import { use, useEffect, useRef, useState } from 'react';

export default function PaymentClient({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { data, isLoading: isDataLoading, error } = useGetPaymentsData(id);
    const [isLoading, setIsLoading] = useState(false);
    const [txHash, setTxHash] = useState<string | null>(null);
    const sdk = useRef<MetaMaskSDK | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        sdk.current = new MetaMaskSDK({
            dappMetadata: {
                name: "Example JavaScript dapp",
                url: window.location.href,
            },
            infuraAPIKey: process.env.NEXT_PUBLIC_INFURA_API_KEY,
        });
    }, []);

    const sendTransaction = async () => {
        if (!sdk.current || !data) return;

        setIsLoading(true);

        try {
            const provider = sdk.current.getProvider();
            if (!provider) throw new Error('MetaMask не найден');

            const accounts = await provider.request({
                method: "eth_requestAccounts"
            }) as string[];

            if (!accounts?.[0]) {
                throw new Error('Кошелек не подключен');
            }

            const from = accounts[0];

            const weiAmount = BigInt(Math.floor(data.amount * 1e18));
            const value = `0x${weiAmount.toString(16)}`;

            const transaction = {
                from,
                to: data.wallet,
                value,
            };

            const txHash = await provider.request({
                method: "eth_sendTransaction",
                params: [transaction],
            }) as string;

            setTxHash(txHash);

        } catch (error: any) {
            console.error('Payment failed:', error);
            if (error.code === 4001) {
                alert('Транзакция отклонена пользователем');
            } else {
                alert(`Ошибка: ${error.message || 'Неизвестная ошибка'}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Проверки в правильном порядке
    if (!id) {
        return <div className="text-white p-8">Неверная ссылка</div>;
    }

    if (isDataLoading) {
        return (
            <div className="flex w-full min-h-screen justify-center items-center">
                <div className="flex flex-row gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-white animate-bounce"></div>
                    <div className="w-5 h-5 rounded-full bg-white animate-bounce [animation-delay:-.3s]"></div>
                    <div className="w-5 h-5 rounded-full bg-white animate-bounce [animation-delay:-.5s]"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-white p-8 max-w-md mx-auto">
                <div className="bg-red-900/50 border border-red-500/30 rounded-lg p-4">
                    <p className="text-red-400">Ошибка загрузки платежа</p>
                    <p className="text-sm text-gray-400 mt-2">{error.message}</p>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-white p-8 max-w-md mx-auto">
                <div className="bg-yellow-900/50 border border-yellow-500/30 rounded-lg p-4">
                    <p className="text-yellow-400">Платёж не найден</p>
                </div>
            </div>
        );
    }

    // Теперь data гарантированно существует
    return (
        <div className="text-white p-8 max-w-md mx-auto">
            <h2 className="text-2xl mb-4 font-bold">
                Оплатить {data.amount} ETH
            </h2>

            <div className="mb-4 p-3 bg-gray-800/50 rounded-lg">
                <p className="text-gray-400 text-sm mb-1">Получатель:</p>
                <p className="font-mono text-sm">
                    {data.wallet.slice(0, 10)}...{data.wallet.slice(-8)}
                </p>
            </div>

            <button
                onClick={sendTransaction}
                disabled={isLoading || !!txHash}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 p-4 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-blue-500/25 disabled:shadow-none disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    'Отправка...'
                ) : txHash ? (
                    '✅ Оплата отправлена'
                ) : (
                    'Оплатить через MetaMask'
                )}
            </button>

            {isLoading && (
                <div className="mt-3 text-center text-gray-400 text-sm">
                    Подтвердите транзакцию в MetaMask...
                </div>
            )}

            {txHash && (
                <div className="mt-4 p-4 bg-green-900/50 border border-green-500/30 rounded-lg">
                    <p className="text-green-400 mb-2 font-semibold">✅ Транзакция отправлена</p>

                    <a
                        href={`https://sepolia.etherscan.io/tx/${txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-sm bg-green-500/20 px-3 py-2 rounded hover:bg-green-500/30 transition-all block text-center"
                    >
                        Посмотреть в Etherscan →
                    </a>

                    <p className="mt-2 text-xs text-gray-400 break-all">
                        {txHash}
                    </p>
                </div>
            )}
        </div>
    )
}