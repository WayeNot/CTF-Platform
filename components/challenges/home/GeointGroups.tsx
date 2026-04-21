import ChallengeCard from "./ChallengeCard";
import ChallengeSection from "./ChallengeSection";

export default function GeointGroups({ data, open }: any) {
    return Object.entries(data).map(([diff, items]: any) => (
        <ChallengeSection key={diff} title={`Difficulté : ${diff}`}>
            {items.length === 0 ? (
                <div className="text-white/20 text-sm">Aucun challenge</div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {items.map((g: any) => (
                        <ChallengeCard key={g.id} title={g.title} disab onClick={() => open("geoint", g.id)}/>
                    ))}
                </div>
            )}
        </ChallengeSection>
    ));
}