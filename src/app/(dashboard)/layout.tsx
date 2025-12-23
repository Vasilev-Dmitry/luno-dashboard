import Navbar from "@/components/global/navbar";

export default async function DashboardLayout({ children }: { children: React.ReactNode; }) {
    return(
        <main>
            <Navbar />
            {children}
        </main>
    )
}