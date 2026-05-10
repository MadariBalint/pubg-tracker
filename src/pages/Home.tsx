import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="min-h-dvh bg-[#161616] px-4 py-8 text-[#f2f2f2] sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-5xl flex-col justify-center gap-8">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#f2b84b]">
            PUBG Toolkit
          </p>
          <h1 className="text-4xl font-bold sm:text-5xl">Choose your tool</h1>
          <p className="max-w-2xl text-base text-[#b9b9b9] sm:text-lg">
            Jump into the tracker or measure mortar distance on an 8 km map.
            Emergency pickup timing still has a reserved spot for later.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Link
            to="/tracker"
            className="group border border-[#555] bg-[#202020] p-5 transition hover:border-[#f2b84b] hover:bg-[#252525]"
          >
            <div className="flex h-full min-h-40 flex-col justify-between gap-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#f2b84b]">
                  Live
                </p>
                <h2 className="mt-2 text-2xl font-bold">Tracker</h2>
                <p className="mt-3 text-sm leading-6 text-[#cfcfcf]">
                  Track team state, unknown deaths, and unknown recalls during a
                  match.
                </p>
              </div>
              <span className="text-sm font-semibold text-white transition group-hover:text-[#f2b84b]">
                Open tracker
              </span>
            </div>
          </Link>

          <Link
            to="/mortar"
            className="group border border-[#555] bg-[#202020] p-5 transition hover:border-[#f2b84b] hover:bg-[#252525]"
          >
            <div className="flex h-full min-h-40 flex-col justify-between gap-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#f2b84b]">
                  Live
                </p>
                <h2 className="mt-2 text-2xl font-bold">
                  Mortar Range Calculator
                </h2>
                <p className="mt-3 text-sm leading-6 text-[#cfcfcf]">
                  Mark two points on an 8 km map and calculate the direct range
                  between them.
                </p>
              </div>
              <span className="text-sm font-semibold text-white transition group-hover:text-[#f2b84b]">
                Open calculator
              </span>
            </div>
          </Link>
          <ToolCard title="Emergency Pickup Timer" />
        </div>
      </div>
    </main>
  );
}

function ToolCard({ title }: { title: string }) {
  return (
    <div className="border border-[#3d3d3d] bg-[#1d1d1d] p-5 text-[#777]">
      <div className="flex h-full min-h-40 flex-col justify-between gap-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em]">
            Soon
          </p>
          <h2 className="mt-2 text-2xl font-bold text-[#9b9b9b]">{title}</h2>
          <p className="mt-3 text-sm leading-6">
            This page can be wired in when the tool is ready.
          </p>
        </div>
        <span className="text-sm font-semibold">Coming soon</span>
      </div>
    </div>
  );
}
