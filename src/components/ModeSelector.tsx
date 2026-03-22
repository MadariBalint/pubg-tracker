import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectMode } from "../features/tracker/trackerSelector";
import {
  addOneTeam,
  deleteTeam,
  resetAllTeams,
  setMode,
} from "../features/tracker/trackerSlice";

export default function ModeSelector() {
  const dispatch = useAppDispatch();
  const mode = useAppSelector(selectMode);

  const baseButton =
    "cursor-pointer border border-[#555]  px-3.5 py-2.5 text-white";
  const activeButton = "bg-[#325d9b]";
  const inactiveButton = "bg-[#242424]";

  return (
    <div className="mb-6 flex gap-2.5">
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
      <button className={baseButton} onClick={() => dispatch(resetAllTeams())}>
        Reset
      </button>

      <button className={baseButton} onClick={() => dispatch(addOneTeam())}>
        Add Team
      </button>
      <button className={baseButton} onClick={() => dispatch(deleteTeam())}>
        Delete Team
      </button>
    </div>
  );
}
