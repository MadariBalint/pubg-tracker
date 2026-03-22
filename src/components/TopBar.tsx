import { useAppSelector } from "../app/hooks";
import {
  selectAlivePlayersTotal,
  selectAliveTeamsTotal,
  selectMode,
  selectTeams,
} from "../features/tracker/trackerSelector";

export default function TopBar() {
  const alivePlayers = useAppSelector(selectAlivePlayersTotal);
  const aliveTeams = useAppSelector(selectAliveTeamsTotal);
  const mode = useAppSelector(selectMode);

  const aliveSolos = useAppSelector(selectTeams).filter(
    (x) => x.alivePlayers === 1 && x,
  ).length;

  const aliveDuos = useAppSelector(selectTeams).filter(
    (x) => x.alivePlayers === 2 && x,
  ).length;

  const aliveTrios = useAppSelector(selectTeams).filter(
    (x) => x.alivePlayers === 3 && x,
  ).length;

  const aliveSquads = useAppSelector(selectTeams).filter(
    (x) => x.alivePlayers === 4 && x,
  ).length;

  return (
    <div className="mb-5 flex items-center gap-4">
      <div className="flex items-center overflow-hidden border border-[#666] bg-[#212121]">
        <span className="bg-[#d85b0f] px-3.5 py-2.5 text-[36px] font-bold leading-none">
          {alivePlayers}
        </span>
        <span className="px-4 text-[18px]">ALIVE</span>
      </div>

      <div className="flex items-center overflow-hidden border border-[#666] bg-[#212121]">
        <span className="bg-[#6a8b1e] px-3.5 py-2.5 text-[36px] font-bold leading-none">
          {aliveTeams}
        </span>
        <span className="px-4 text-[18px]">TEAMS</span>
      </div>

      <div className="flex gap-5 ml-10 ">
        <div className="flex flex-col items-center">
          <span>👤</span>
          <span>{aliveSolos}</span>
        </div>
        <div className="flex flex-col items-center">
          <span>👤👤</span>
          <span>{aliveDuos}</span>
        </div>
        {mode === "squad" && (
          <div className="flex flex-col items-center">
            <span>👤👤👤</span>
            <span>{aliveTrios}</span>
          </div>
        )}

        {mode === "squad" && (
          <div className="flex flex-col items-center">
            <span>👤👤👤👤</span>
            <span>{aliveSquads}</span>
          </div>
        )}
      </div>

      <div className="ml-auto text-[18px]">
        Mode: <strong> {mode === "squad" ? "Squad" : "Duo"}</strong>
      </div>
    </div>
  );
}
