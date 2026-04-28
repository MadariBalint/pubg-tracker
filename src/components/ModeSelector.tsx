import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectMode } from "../features/tracker/trackerSelector";
import {
  addOneTeam,
  deleteTeam,
  resetAllTeams,
  setMode,
  setStartSlotToOne,
  setStartSlotToThree,
  setStartSlotToTwo,
} from "../features/tracker/trackerSlice";

type ModeSelectorProps = {
  onReset: () => void;
};

export default function ModeSelector({ onReset }: ModeSelectorProps) {
  const dispatch = useAppDispatch();
  const mode = useAppSelector(selectMode);

  const baseButton =
    "cursor-pointer border border-[#555] px-3 py-2.5 text-white grow basis-[calc(50%-0.25rem)] sm:basis-auto sm:flex-1 whitespace-nowrap text-sm sm:text-base";
  const activeButton = "bg-[#325d9b]";
  const inactiveButton = "bg-[#242424]";

  return (
    <div className="mb-2 flex flex-wrap gap-1 sm:gap-2 lg:mb-6 lg:gap-2.5">
      <button
        className={`${baseButton} ${mode === "squad" ? activeButton : inactiveButton}`}
        onClick={() => dispatch(setMode("squad"))}
      >
        Squad
      </button>
      <button
        className={`${baseButton} ${mode === "duo" ? activeButton : inactiveButton}`}
        onClick={() => dispatch(setMode("duo"))}
      >
        Duo
      </button>
      <button
        className={baseButton}
        onClick={() => {
          dispatch(resetAllTeams());
          onReset();
        }}
      >
        Reset
      </button>

      <button className={baseButton} onClick={() => dispatch(addOneTeam())}>
        Add Team
      </button>
      <button className={baseButton} onClick={() => dispatch(deleteTeam())}>
        Delete Team
      </button>
      <button
        className={baseButton}
        onClick={() => dispatch(setStartSlotToOne())}
      >
        Start Slot #1
      </button>
      <button
        className={baseButton}
        onClick={() => dispatch(setStartSlotToTwo())}
      >
        Start Slot #2
      </button>
      <button
        className={baseButton}
        onClick={() => dispatch(setStartSlotToThree())}
      >
        Start Slot #3
      </button>
    </div>
  );
}
