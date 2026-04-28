import { useAppSelector } from "../app/hooks";
import { selectTeams } from "../features/tracker/trackerSelector";
import TeamCard from "./TeamCard";

export default function TeamGrid() {
  const teams = useAppSelector(selectTeams);
  const teamCount = teams.length;
  const colsAmount =
    teamCount <= 18
      ? "sm:grid-cols-5"
      : teamCount <= 28
        ? "sm:grid-cols-6"
        : teamCount <= 33
          ? "sm:grid-cols-7"
          : teamCount <= 38
            ? "sm:grid-cols-8"
            : teamCount <= 43
              ? "sm:grid-cols-9"
              : "sm:grid-cols-10";

  return (
    <div className={`grid grid-cols-2 gap-2 sm:gap-3 ${colsAmount}`}>
      {teams.map((team) => (
        <TeamCard key={team.id} team={team} />
      ))}
    </div>
  );
}
