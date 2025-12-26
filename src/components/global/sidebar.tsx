import Link from "next/link";

import { Settings, ChartColumnBig, Store, MessageCircleQuestionMark } from "lucide-react";

export default function Sidebar() {
    return (
        <aside className="flex flex-col items-center gap-6 py-5 min-h-screen p-2 bg-neutral-950 border-r border-neutral-800">
            <div className="h-8 w-8 rounded-full bg-blue-400" />
            <div className="flex flex-col items-center gap-1.5">
                <Link href="/stores" className="flex group h-10 w-10 justify-center items-center bg-transparent hover:bg-neutral-800 transition-colors duration-200 rounded-lg">
                    <Store strokeWidth={1.8} size={20} className="text-neutral-400 group-hover:text-white delay-75"/>
                </Link>
                <Link href="/analytics" className="flex group h-10 w-10 justify-center items-center bg-transparent hover:bg-neutral-800 transition-colors duration-200 rounded-lg">
                    <ChartColumnBig strokeWidth={1.8} size={20} className="text-neutral-400 group-hover:text-white delay-75"/>
                </Link>
                <div className="h-px w-full rounded-full bg-neutral-800" />
                <Link href="/settings" className="flex group h-10 w-10 justify-center items-center bg-transparent hover:bg-neutral-800 transition-colors duration-200 rounded-lg">
                    <Settings strokeWidth={1.8} size={20} className="text-neutral-400 group-hover:text-white delay-75"/>
                </Link>
                <Link href="/settings" className="flex group h-10 w-10 justify-center items-center bg-transparent hover:bg-neutral-800 transition-colors duration-200 rounded-lg">
                    <MessageCircleQuestionMark strokeWidth={1.8} size={20} className="text-neutral-400 group-hover:text-white delay-75"/>
                </Link>
            </div>
        </aside>
    )
}