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
    <div className=" flex flex-col ">
      <button
        className={[
          "flex items-center gap-2 overflow-hidden rounded-2xl border p-2 sm:rounded-[24px] sm:p-3",
          isDead
            ? "border-[#0b0b0b] bg-gradient-to-r from-[#4f4f4f] to-[#5b5b5b] text-[#a7a7a7] opacity-95"
            : "border-[#0b0b0b] bg-gradient-to-r from-[#1e2f46] to-[#22314f] text-white",
        ].join(" ")}
        onClick={handleLeftClick}
        onContextMenu={handleRightClick}
      >
        <img src={team.flag} alt="" className="h-auto w-[48%] object-contain" />

        <span
          className={[
            "flex-1 text-center font-light leading-none text-3xl sm:text-4xl lg:text-5xl",
            isDead ? "text-white/35" : "text-white/85",
          ].join(" ")}
        >
          {team.alivePlayers}
        </span>
      </button>

      <div
        className={[
          "truncate text-sm sm:text-base lg:text-lg",
          isDead ? "text-[#8a8a8a]" : "text-[#8ba4c3]",
        ].join(" ")}
      >
        {team.slot} {team.name}
      </div>
    </div>
  );
}
