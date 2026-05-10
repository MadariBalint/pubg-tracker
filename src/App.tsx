import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import MortarCalculator from "./pages/MortarCalculator";
import Tracker from "./pages/Tracker";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tracker" element={<Tracker />} />
        <Route path="/mortar" element={<MortarCalculator />} />
      </Routes>
    </BrowserRouter>
  );
}
