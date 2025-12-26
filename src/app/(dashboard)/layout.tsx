import Navbar from "@/components/global/navbar";
import Sidebar from "@/components/global/sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode; }) {
    return(
        <main className="flex w-full min-h-screen">
            <Sidebar />
            <div className="flex w-full flex-col bg-neutral-950">
                <Navbar />
                {children}
            </div>
        </main>
    )
}