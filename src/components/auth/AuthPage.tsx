import ConnectWallet from "@/components/auth/ConnectWallet";

export default function AuthPage() {

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="p-6 bg-neutral-900 rounded-2xl w-full max-w-[420px]">
                <h2 className="text-2xl font-semibold mb-1 text-white">Connect wallet</h2>
                <p className="text-[13px] text-neutral-500 font-medium leading-tight">Get started by connecting your preferred wallet bellow.</p>

                <ConnectWallet />

                <p className="text-[13px] text-neutral-400 font-medium leading-tight">By connecting your wallet, you'r agree to our <span className="text-blue-600 cursor-pointer">Terms of Service</span> and our <span className="text-blue-600 cursor-pointer">Privacy Policy</span></p>
            </div>
        </div>
    );
}
