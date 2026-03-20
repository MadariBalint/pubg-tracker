import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectMode } from "../features/tracker/trackerSelector";
import { resetAllTeams, setMode } from "../features/tracker/trackerSlice";

export default function ModeSelector() {
  const dispatch = useAppDispatch();
  const mode = useAppSelector(selectMode);

  const baseButton =
    "cursor-pointer border border-[#555] bg-[#242424] px-3.5 py-2.5 text-white";
  const activeButton = "bg-[#325d9b]";

  return (
    <div className="mb-6 flex gap-2.5">
      <button
        className={`${baseButton} ${mode === "squad" ? activeButton : ""}`}
        onClick={() => dispatch(setMode("squad"))}
      >
        Squad
      </button>
      <button
        className={`${baseButton} ${mode === "duo" ? activeButton : ""}`}
        onClick={() => dispatch(setMode("duo"))}
      >
        Duo
      </button>
      <button className={baseButton} onClick={() => dispatch(resetAllTeams())}>
        Reset
      </button>
    </div>
  );
}
