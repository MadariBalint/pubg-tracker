import { useAppSelector } from "../app/hooks";
import { selectTeams } from "../features/tracker/trackerSelector";
import TeamCard from "./TeamCard";

export default function TeamGrid() {
  const teams = useAppSelector(selectTeams);

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5">
      {teams.map((team) => (
        <TeamCard key={team.id} team={team} />
      ))}
    </div>
  );
}
