import { useState } from "react";
import ModeSelector from "./components/ModeSelector";
import TeamGrid from "./components/TeamGrid";
import TopBar from "./components/TopBar";

export default function App() {
  const baseButton =
    "cursor-pointer border border-[#555] px-3 py-2.5 text-white grow basis-[calc(50%-0.25rem)] sm:basis-auto sm:flex-1 whitespace-nowrap text-sm sm:text-base";
  const [unknownDeaths, setUnknownDeaths] = useState(0);
  const [unknownRecalls, setUnknownRecalls] = useState(0);

  const handleLeftClickDeaths = () => {
    setUnknownDeaths(unknownDeaths + 1);
  };
  const handleLeftClickRecalls = () => {
    setUnknownRecalls(unknownRecalls + 1);
  };
  const handleRightClickDeaths = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    if (unknownDeaths !== 0) setUnknownDeaths(unknownDeaths - 1);
  };

  const handleRightClickRecalls = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    if (unknownRecalls !== 0) setUnknownRecalls(unknownRecalls - 1);
  };
  const handleResetTracker = () => {
    setUnknownDeaths(0);
    setUnknownRecalls(0);
  };

  return (
    <div className="min-h-dvh bg-[#161616] p-3 text-[#f2f2f2] sm:p-5">
      <div className="flex min-h-dvh w-full flex-col items-center justify-between gap-2 sm:min-h-[calc(100dvh-2.5rem)] lg:gap-1.5">
        <div className="mx-auto w-full max-w-[1280px]">
          <TopBar
            unknownDeaths={unknownDeaths}
            unknownRecalls={unknownRecalls}
          />
          <ModeSelector onReset={handleResetTracker} />
        </div>

        <div className="w-full grow max-w-[1600px]">
          <TeamGrid />
        </div>
        <div className="mb-2 flex w-full max-w-[1600px] flex-wrap gap-1 sm:gap-2 lg:mb-6">
          <button
            onClick={handleLeftClickDeaths}
            onContextMenu={handleRightClickDeaths}
            className={`${baseButton}`}
          >
            Unknown Deaths <span>{unknownDeaths}</span>
          </button>
          <button
            onClick={handleLeftClickRecalls}
            onContextMenu={handleRightClickRecalls}
            className={`${baseButton}`}
          >
            Unknown Recalls <span>{unknownRecalls}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
