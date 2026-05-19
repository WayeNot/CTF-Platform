import ChallengeCard from "./ChallengeCard";
import ChallengeSection from "./ChallengeSection";

export default function ChallengeGroups({ data, open, type }: any) {
    return Object.entries(data).map(([diff, items]: any) => (
        <ChallengeSection key={diff} title={`Difficulté : ${diff}`}>
            {items.length === 0 ? <div className="text-white/20 text-sm">Aucun challenge</div> : (
                <div className="flex items-center gap-3">
                    {items.map((g: any) => (
                        <ChallengeCard key={g.id} title={g.title} disab onClick={() => open(type, g.id)} />
                    ))}
                </div>
            )}
        </ChallengeSection>
    ));
}