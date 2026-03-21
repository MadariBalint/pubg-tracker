import ModeSelector from "./components/ModeSelector";
import TeamGrid from "./components/TeamGrid";
import TopBar from "./components/TopBar";

export default function App() {
  return (
    <div className="h-dvh bg-[#161616] p-5 text-[#f2f2f2]">
      <div className="flex flex-col items-center">
        <div className="mx-auto w-3/4 ">
          <TopBar />
          <ModeSelector />
        </div>

        <div className="w-4/5">
          <TeamGrid />
        </div>
      </div>
    </div>
  );
}
