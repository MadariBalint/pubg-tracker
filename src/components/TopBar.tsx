import { useAppSelector } from "../app/hooks";
import {
  selectAlivePlayersTotal,
  selectAliveTeamsTotal,
  selectMode,
} from "../features/tracker/trackerSelector";

export default function TopBar() {
  const alivePlayers = useAppSelector(selectAlivePlayersTotal);
  const aliveTeams = useAppSelector(selectAliveTeamsTotal);
  const mode = useAppSelector(selectMode);

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

      <div className="ml-auto text-[18px]">
        Mode: <strong> {mode === "squad" ? "Squad" : "Duo"}</strong>
      </div>
    </div>
  );
}
