import { useState } from "react";
import ModeSelector from "./components/ModeSelector";
import TeamGrid from "./components/TeamGrid";
import TopBar from "./components/TopBar";

export default function App() {
  const baseButton =
    "cursor-pointer border border-[#555]  px-3.5 py-2.5 text-white flex-1";
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

  return (
    <div className="min-h-dvh bg-[#161616] p-5 text-[#f2f2f2]">
      <div className="flex flex-col items-center gap-2">
        <div className="mx-auto w-3/4 ">
          <TopBar
            unknownDeaths={unknownDeaths}
            unknownRecalls={unknownRecalls}
          />
          <ModeSelector />
        </div>

        <div className="w-4/5">
          <TeamGrid />
        </div>
        <div className="mb-2 gap-1 lg:mb-6 flex flex-wrap lg:text-nowrap lg:gap-2.5 ">
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
