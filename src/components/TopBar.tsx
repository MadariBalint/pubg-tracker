import { useAppSelector } from "../app/hooks";
import {
  selectAlivePlayersTotal,
  selectAliveTeamsTotal,
  selectMode,
  selectTeams,
} from "../features/tracker/trackerSelector";

type TopBarProps = {
  unknownDeaths: number;
  unknownRecalls: number;
};

export default function TopBar({ unknownDeaths, unknownRecalls }: TopBarProps) {
  const alivePlayers =
    useAppSelector(selectAlivePlayersTotal) - unknownDeaths + unknownRecalls;
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
    <div className="mb-2 flex flex-col gap-3 lg:mb-5 lg:flex-row lg:items-center lg:gap-4">
      <div className="flex justify-center lg:justify-start w-full items-center overflow-hidden border border-[#666] bg-[#212121] sm:w-auto">
        <span className="bg-[#d85b0f] px-3 py-2.5 text-3xl font-bold leading-none sm:px-3.5 lg:text-[36px]">
          {alivePlayers}
        </span>
        <span className="px-3 text-base sm:px-4 sm:text-[18px]">ALIVE</span>
      </div>

      <div className="flex justify-center lg:justify-start w-full items-center overflow-hidden border border-[#666] bg-[#212121] sm:w-auto">
        <span className="bg-[#6a8b1e] px-3 py-2.5 text-3xl font-bold leading-none sm:px-3.5 lg:text-[36px]">
          {aliveTeams}
        </span>
        <span className="px-3 text-base sm:px-4 sm:text-[18px]">TEAMS</span>
      </div>

      <div className="grid justify-center lg:justify-start w-full grid-cols-2 gap-x-6 gap-y-2 sm:flex sm:w-auto sm:gap-5 lg:ml-10">
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

      <div className="text-base sm:text-[18px] lg:ml-auto">
        Mode: <strong> {mode === "squad" ? "Squad" : "Duo"}</strong>
      </div>
    </div>
  );
}
