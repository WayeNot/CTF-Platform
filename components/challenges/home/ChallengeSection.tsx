export default function ChallengeSection({ title, children }: any) {
    return (
        <div className="space-y-4 mt-5">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-white/30"><span className="h-px w-6 bg-white/20" />{title}<span className="h-px flex-1 bg-white/10" /></div>
            {children}
        </div>
    );
}