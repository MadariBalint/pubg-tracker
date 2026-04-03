import { useAppSelector } from "../app/hooks";
import { selectTeams } from "../features/tracker/trackerSelector";
import TeamCard from "./TeamCard";

export default function TeamGrid() {
  const teams = useAppSelector(selectTeams);
  const teamCount = teams.length;
  const colsAmount =
    teamCount <= 18
      ? "grid-cols-5"
      : teamCount <= 28
        ? "grid-cols-6"
        : teamCount <= 33
          ? "grid-cols-7"
          : teamCount <= 38
            ? "grid-cols-8"
            : teamCount <= 43
              ? "grid-cols-9"
              : "grid-cols-10";

  return (
    <div className={`grid ${colsAmount} gap-3`}>
      {teams.map((team) => (
        <TeamCard key={team.id} team={team} />
      ))}
    </div>
  );
}
