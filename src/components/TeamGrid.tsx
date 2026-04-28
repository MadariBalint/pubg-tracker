import { useAppSelector } from "../app/hooks";
import { selectTeams } from "../features/tracker/trackerSelector";
import TeamCard from "./TeamCard";

export default function TeamGrid() {
  const teams = useAppSelector(selectTeams);
  const teamCount = teams.length;
  const colsAmount =
    teamCount <= 24
      ? "sm:grid-cols-4 lg:grid-cols-6"
      : teamCount <= 28
        ? "sm:grid-cols-5 lg:grid-cols-7"
        : teamCount <= 40
          ? "sm:grid-cols-5 lg:grid-cols-8"
          : teamCount <= 45
            ? "sm:grid-cols-6 lg:grid-cols-9"
            : "sm:grid-cols-6 lg:grid-cols-10";

  return (
    <div className={`grid grid-cols-2 gap-2 sm:gap-2.5 lg:gap-2 ${colsAmount}`}>
      {teams.map((team) => (
        <TeamCard key={team.id} team={team} />
      ))}
    </div>
  );
}
