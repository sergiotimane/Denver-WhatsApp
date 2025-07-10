import { cn } from "@/lib/utils";
import { FEUser } from "@/types/user";

export default function UserLetterIcon({ user, className }: { user: {firstName: string | null, lastName: string | null}, className: string | undefined }) {
    return (
        <div className={cn('w-8 h-8 rounded-full border border-slate-700 flex items-center justify-center font-bold text-white flex-shrink-0', className)}>
            <img src='/assets/img/user.svg' className='h-4' />
        </div>
    )
}