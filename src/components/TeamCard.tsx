import { useAppDispatch } from "../app/hooks";
import {
  decreaseAlivePlayers,
  increaseAlivePlayers,
} from "../features/tracker/trackerSlice";

import type { MouseEvent } from "react";

import type { Team } from "../features/tracker/trackerTypes";

type TeamCardProps = {
  team: Team;
};

export default function TeamCard({ team }: TeamCardProps) {
  const dispatch = useAppDispatch();
  const isDead = team.alivePlayers === 0;

  const handleLeftClick = () => {
    dispatch(decreaseAlivePlayers(team.id));
  };
  const handleRightClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    dispatch(increaseAlivePlayers(team.id));
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        className={[
          "flex min-h-[104px] cursor-pointer items-center justify-between rounded-[24px] border px-[18px] py-[14px]",
          isDead
            ? "border-[#0b0b0b] bg-gradient-to-r from-[#4f4f4f] to-[#5b5b5b] text-[#a7a7a7] opacity-95"
            : "border-[#0b0b0b] bg-gradient-to-r from-[#1e2f46] to-[#22314f] text-white",
        ].join(" ")}
        onClick={handleLeftClick}
        onContextMenu={handleRightClick}
      >
        <span className="text-[72px] leading-none">{team.flag}</span>

        <span
          className={[
            "text-[56px] font-light",
            isDead ? "text-white/35" : "text-white/85",
          ].join(" ")}
        >
          {team.alivePlayers}
        </span>
      </button>

      <div
        className={
          isDead ? "text-[18px] text-[#8a8a8a]" : "text-[18px] text-[#8ba4c3]"
        }
      >
        {team.slot} {team.name}
      </div>
    </div>
  );
}
