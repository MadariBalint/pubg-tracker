import ModeSelector from "./components/ModeSelector";
import TeamGrid from "./components/TeamGrid";
import TopBar from "./components/TopBar";

export default function App() {
  return (
    <div className="min-h-screen bg-[#161616] p-5 text-[#f2f2f2]">
      <TopBar />
      <ModeSelector />
      <TeamGrid />
    </div>
  );
}
