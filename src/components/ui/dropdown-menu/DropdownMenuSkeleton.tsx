export default function DropdownMenuSkeleton() {
    return (
        <button className="flex group px-3.5 h-11 gap-3 w-full justify-center items-center rounded-lg">
            <div className="size-7 bg-neutral-500 animate-pulse rounded-full" />
            <div className="rounded bg-neutral-500 animate-pulse h-3.5 w-16 pb-0.5" />
        </button>
    );
}
