import { Link } from "react-router-dom";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type MapPoint = {
  x: number;
  y: number;
};

type Pan = {
  x: number;
  y: number;
};

type DragState = {
  pointerId: number;
  startX: number;
  startY: number;
  panX: number;
  panY: number;
  moved: boolean;
};

type ActivePointer = {
  pointerId: number;
  clientX: number;
  clientY: number;
};

type PinchState = {
  pointerIds: [number, number];
  startDistance: number;
  startZoom: number;
  mapPixelX: number;
  mapPixelY: number;
};

type GameMap = {
  name: string;
  image: string;
};

const MAP_SIZE_KM = 8;
const MIN_ZOOM = 1;
const MAX_ZOOM = 12;
const ZOOM_STEP = 0.5;
const MAPS: GameMap[] = [
  { name: "Erangel", image: "/images/erangel.jpg" },
  { name: "Miramar", image: "/images/miramar.jpg" },
  { name: "Rondo", image: "/images/rondo.jpg" },
  { name: "Taego", image: "/images/taego.jpg" },
];

function waitForNextFrame() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getConstrainedPan(pan: Pan, zoom: number, viewportSize: number) {
  if (zoom <= MIN_ZOOM) return { x: 0, y: 0 };

  const minPan = viewportSize - viewportSize * zoom;

  return {
    x: clamp(pan.x, minPan, 0),
    y: clamp(pan.y, minPan, 0),
  };
}

function getPointerDistance(first: ActivePointer, second: ActivePointer) {
  return Math.hypot(first.clientX - second.clientX, first.clientY - second.clientY);
}

function getPointerCenter(first: ActivePointer, second: ActivePointer) {
  return {
    clientX: (first.clientX + second.clientX) / 2,
    clientY: (first.clientY + second.clientY) / 2,
  };
}

function formatPoint(point: MapPoint | undefined) {
  if (!point) return "--";

  return `${(point.x * MAP_SIZE_KM).toFixed(2)} km, ${(
    point.y * MAP_SIZE_KM
  ).toFixed(2)} km`;
}

export default function MortarCalculator() {
  const mapRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const activePointersRef = useRef<Map<number, ActivePointer>>(new Map());
  const pinchRef = useRef<PinchState | null>(null);
  const mapImageRefs = useRef<Record<string, HTMLImageElement | null>>({});
  const [points, setPoints] = useState<MapPoint[]>([]);
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const [pan, setPan] = useState<Pan>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [selectedMap, setSelectedMap] = useState<GameMap>(MAPS[0]);
  const [isMapSwitching, setIsMapSwitching] = useState(false);

  useEffect(() => {
    const preloadedMaps = MAPS.map((gameMap) => {
      const image = new Image();
      image.src = gameMap.image;
      return image;
    });

    return () => {
      preloadedMaps.forEach((image) => {
        image.src = "";
      });
    };
  }, []);

  const distance = useMemo(() => {
    if (points.length < 2) return null;

    const [first, second] = points;
    const deltaX = (second.x - first.x) * MAP_SIZE_KM;
    const deltaY = (second.y - first.y) * MAP_SIZE_KM;

    return Math.hypot(deltaX, deltaY);
  }, [points]);

  const placePoint = useCallback((clientX: number, clientY: number) => {
    const bounds = mapRef.current?.getBoundingClientRect();
    if (!bounds) return;

    const x = (clientX - bounds.left - pan.x) / (bounds.width * zoom);
    const y = (clientY - bounds.top - pan.y) / (bounds.height * zoom);
    if (x < 0 || x > 1 || y < 0 || y > 1) return;

    const nextPoint = {
      x: clamp(x, 0, 1),
      y: clamp(y, 0, 1),
    };

    setPoints((currentPoints) =>
      currentPoints.length >= 2 ? [nextPoint] : [...currentPoints, nextPoint],
    );
  }, [pan.x, pan.y, zoom]);

  const startPinch = useCallback(() => {
    const bounds = mapRef.current?.getBoundingClientRect();
    const activePointers = Array.from(activePointersRef.current.values());
    if (!bounds || activePointers.length < 2) return;

    const [first, second] = activePointers;
    const center = getPointerCenter(first, second);
    const centerX = center.clientX - bounds.left;
    const centerY = center.clientY - bounds.top;

    pinchRef.current = {
      pointerIds: [first.pointerId, second.pointerId],
      startDistance: getPointerDistance(first, second),
      startZoom: zoom,
      mapPixelX: (centerX - pan.x) / zoom,
      mapPixelY: (centerY - pan.y) / zoom,
    };

    dragRef.current = null;
    setIsDragging(true);
  }, [pan.x, pan.y, zoom]);

  const updateZoom = (nextZoom: number, anchorX = 0.5, anchorY = 0.5) => {
    if (isMapSwitching) return;

    const bounds = mapRef.current?.getBoundingClientRect();
    if (!bounds) return;

    const clampedZoom = clamp(nextZoom, MIN_ZOOM, MAX_ZOOM);
    const anchorPixel = {
      x: bounds.width * anchorX,
      y: bounds.height * anchorY,
    };
    const mapPixel = {
      x: (anchorPixel.x - pan.x) / zoom,
      y: (anchorPixel.y - pan.y) / zoom,
    };

    setZoom(clampedZoom);
    setPan(
      getConstrainedPan(
        {
          x: anchorPixel.x - mapPixel.x * clampedZoom,
          y: anchorPixel.y - mapPixel.y * clampedZoom,
        },
        clampedZoom,
        bounds.width,
      ),
    );
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (isMapSwitching) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const zoomDirection = event.deltaY < 0 ? 1 : -1;
    const nextZoom = zoom + zoomDirection * ZOOM_STEP;

    updateZoom(
      nextZoom,
      (event.clientX - bounds.left) / bounds.width,
      (event.clientY - bounds.top) / bounds.height,
    );
  };

  const movePinch = useCallback(() => {
    const pinch = pinchRef.current;
    const bounds = mapRef.current?.getBoundingClientRect();
    if (!pinch || !bounds) return;

    const [firstId, secondId] = pinch.pointerIds;
    const first = activePointersRef.current.get(firstId);
    const second = activePointersRef.current.get(secondId);
    if (!first || !second || pinch.startDistance === 0) return;

    const center = getPointerCenter(first, second);
    const centerX = center.clientX - bounds.left;
    const centerY = center.clientY - bounds.top;
    const distanceRatio = getPointerDistance(first, second) / pinch.startDistance;
    const nextZoom = clamp(pinch.startZoom * distanceRatio, MIN_ZOOM, MAX_ZOOM);

    setZoom(nextZoom);
    setPan(
      getConstrainedPan(
        {
          x: centerX - pinch.mapPixelX * nextZoom,
          y: centerY - pinch.mapPixelY * nextZoom,
        },
        nextZoom,
        bounds.width,
      ),
    );
  }, []);

  const moveDrag = useCallback((pointerId: number, clientX: number, clientY: number) => {
    const drag = dragRef.current;
    const bounds = mapRef.current?.getBoundingClientRect();
    if (!drag || !bounds || pointerId !== drag.pointerId) return;

    const deltaX = clientX - drag.startX;
    const deltaY = clientY - drag.startY;
    const moved = Math.hypot(deltaX, deltaY) > 4;
    drag.moved = drag.moved || moved;

    if (zoom <= MIN_ZOOM) return;

    setPan(
      getConstrainedPan(
        {
          x: drag.panX + deltaX,
          y: drag.panY + deltaY,
        },
        zoom,
        bounds.width,
      ),
    );
  }, [zoom]);

  const stopDragging = useCallback((
    pointerId: number,
    shouldPlacePoint: boolean,
    clientX: number,
    clientY: number,
  ) => {
    const drag = dragRef.current;
    if (!drag || pointerId !== drag.pointerId) return;

    if (shouldPlacePoint && !drag.moved) {
      placePoint(clientX, clientY);
    }

    dragRef.current = null;
    setIsDragging(false);
  }, [placePoint]);

  useEffect(() => {
    if (!isDragging) return;

    const handleWindowPointerMove = (event: PointerEvent) => {
      event.preventDefault();
      activePointersRef.current.set(event.pointerId, {
        pointerId: event.pointerId,
        clientX: event.clientX,
        clientY: event.clientY,
      });

      if (pinchRef.current) {
        movePinch();
        return;
      }

      moveDrag(event.pointerId, event.clientX, event.clientY);
    };

    const handleWindowPointerUp = (event: PointerEvent) => {
      event.preventDefault();
      const wasPinching = pinchRef.current !== null;
      activePointersRef.current.delete(event.pointerId);

      if (wasPinching) {
        pinchRef.current = null;
        dragRef.current = null;
        activePointersRef.current.clear();
        setIsDragging(false);
        return;
      }

      stopDragging(event.pointerId, true, event.clientX, event.clientY);
    };

    const handleWindowPointerCancel = (event: PointerEvent) => {
      event.preventDefault();
      const wasPinching = pinchRef.current !== null;
      activePointersRef.current.delete(event.pointerId);
      pinchRef.current = null;

      if (wasPinching) {
        dragRef.current = null;
        activePointersRef.current.clear();
        setIsDragging(false);
        return;
      }

      stopDragging(event.pointerId, false, event.clientX, event.clientY);
    };

    window.addEventListener("pointermove", handleWindowPointerMove, {
      passive: false,
    });
    window.addEventListener("pointerup", handleWindowPointerUp, {
      passive: false,
    });
    window.addEventListener("pointercancel", handleWindowPointerCancel, {
      passive: false,
    });

    return () => {
      window.removeEventListener("pointermove", handleWindowPointerMove);
      window.removeEventListener("pointerup", handleWindowPointerUp);
      window.removeEventListener("pointercancel", handleWindowPointerCancel);
    };
  }, [isDragging, moveDrag, movePinch, stopDragging]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || isMapSwitching) return;

    event.preventDefault();
    activePointersRef.current.set(event.pointerId, {
      pointerId: event.pointerId,
      clientX: event.clientX,
      clientY: event.clientY,
    });

    if (activePointersRef.current.size >= 2) {
      startPinch();
      return;
    }

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      panX: pan.x,
      panY: pan.y,
      moved: false,
    };
    setIsDragging(true);
  };

  const resetView = () => {
    setZoom(MIN_ZOOM);
    setPan({ x: 0, y: 0 });
  };

  const resetMapState = () => {
    dragRef.current = null;
    pinchRef.current = null;
    activePointersRef.current.clear();
    setIsDragging(false);
    setPoints([]);
    resetView();
  };

  const handleMapChange = async (nextMap: GameMap) => {
    if (nextMap.name === selectedMap.name || isMapSwitching) return;

    setIsMapSwitching(true);
    resetMapState();
    await waitForNextFrame();

    const nextImage = mapImageRefs.current[nextMap.name];
    if (nextImage?.decode) {
      await nextImage.decode().catch(() => undefined);
    }

    setSelectedMap(nextMap);
    await waitForNextFrame();
    setIsMapSwitching(false);
  };

  return (
    <main className="min-h-dvh bg-[#161616] px-3 py-4 text-[#f2f2f2] sm:px-5">
      <div className="mx-auto flex min-h-[calc(100dvh-2rem)] w-full max-w-7xl flex-col gap-4">
        <header className="flex flex-wrap items-center justify-between gap-3 border border-[#3d3d3d] bg-[#202020] px-4 py-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#f2b84b]">
              PUBG Toolkit
            </p>
            <h1 className="text-2xl font-bold sm:text-3xl">
              Mortar Range Calculator
            </h1>
          </div>
          <Link
            to="/"
            className="border border-[#555] px-3 py-2 text-sm font-semibold transition hover:border-[#f2b84b] hover:text-[#f2b84b]"
          >
            Back
          </Link>
        </header>

        <section className="grid grow gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="flex min-h-0 items-center justify-center">
            <div
              className="aspect-square border border-[#3d3d3d] bg-[#202020] p-2 sm:p-4"
              style={{
                width: "min(100%, 900px, calc(100dvh - 12rem))",
              }}
            >
              <div
                ref={mapRef}
                role="button"
                tabIndex={0}
                aria-label="Mortar distance map"
                onWheel={handleWheel}
                onPointerDown={handlePointerDown}
                onDragStart={(event) => event.preventDefault()}
                onContextMenu={(event) => event.preventDefault()}
                className={`relative h-full w-full touch-none overflow-hidden text-left shadow-[0_0_0_1px_rgba(255,255,255,0.04)] ${
                  isMapSwitching
                    ? "cursor-wait"
                    : isDragging
                      ? "cursor-grabbing"
                      : "cursor-crosshair"
                }`}
              >
                <span className="pointer-events-none absolute inset-0 z-10 border border-[#555]" />
                <div
                  className="absolute"
                  style={{
                    left: `${pan.x}px`,
                    top: `${pan.y}px`,
                    width: `${zoom * 100}%`,
                    height: `${zoom * 100}%`,
                  }}
                >
                  {MAPS.map((gameMap) => (
                    <img
                      ref={(image) => {
                        mapImageRefs.current[gameMap.name] = image;
                      }}
                      key={gameMap.name}
                      src={gameMap.image}
                      alt=""
                      aria-hidden="true"
                      draggable="false"
                      loading="eager"
                      decoding="async"
                      className={`pointer-events-none absolute inset-0 h-full w-full select-none object-fill transition-opacity duration-75 ${
                        gameMap.name === selectedMap.name
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    />
                  ))}
                  <span className="pointer-events-none absolute inset-0 bg-black/10" />
                  <span
                    className="pointer-events-none absolute inset-0"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, rgba(242, 184, 75, 0.45) 1px, transparent 1px), linear-gradient(to bottom, rgba(242, 184, 75, 0.45) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.16) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.16) 1px, transparent 1px)",
                      backgroundSize:
                        "12.5% 12.5%, 12.5% 12.5%, 1.25% 1.25%, 1.25% 1.25%",
                    }}
                  />

                  {points.length === 2 && (
                    <svg
                      className="pointer-events-none absolute inset-0 h-full w-full"
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                    >
                      <line
                        x1={points[0].x * 100}
                        y1={points[0].y * 100}
                        x2={points[1].x * 100}
                        y2={points[1].y * 100}
                        stroke="#f2b84b"
                        strokeWidth={0.55 / zoom}
                        strokeLinecap="round"
                      />
                    </svg>
                  )}

                  {points.map((point, index) => (
                    <span
                      key={`${point.x}-${point.y}-${index}`}
                      className="pointer-events-none absolute h-11 w-8"
                      style={{
                        left: `${point.x * 100}%`,
                        top: `${point.y * 100}%`,
                        transform: "translate(-50%, -100%)",
                      }}
                    >
                      <svg
                        className="absolute inset-0 h-full w-full overflow-visible drop-shadow-[0_2px_4px_rgba(0,0,0,0.75)]"
                        viewBox="0 0 32 44"
                        aria-hidden="true"
                      >
                        <path
                          d="M16 44L5.4 25.2C2.8 20.8 2.7 15.4 5.1 10.9C7.5 6.5 11.6 4 16 4C20.4 4 24.5 6.5 26.9 10.9C29.3 15.4 29.2 20.8 26.6 25.2L16 44Z"
                          fill="#d64035"
                          stroke="#ffffff"
                          strokeWidth="2.5"
                        />
                      </svg>
                      <span className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-white">
                        {index === 0 ? "A" : "B"}
                      </span>
                    </span>
                  ))}
                </div>
                {isMapSwitching && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#161616]">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#555] border-t-[#f2b84b]" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <aside className="border border-[#3d3d3d] bg-[#202020] p-4">
            <div className="grid gap-3">
              <Metric
                label="Map size"
                value={`${MAP_SIZE_KM} km x ${MAP_SIZE_KM} km`}
              />
              <Metric label="Map" value={selectedMap.name} />
              <Metric label="Zoom" value={`${zoom.toFixed(1)}x`} />
              <Metric label="Point A" value={formatPoint(points[0])} />
              <Metric label="Point B" value={formatPoint(points[1])} />
              <Metric
                label="Distance"
                value={
                  distance === null
                    ? "--"
                    : `${distance.toFixed(2)} km / ${Math.round(
                        distance * 1000,
                      ).toLocaleString()} m`
                }
                isPrimary
              />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <button
                type="button"
                disabled={isMapSwitching}
                onClick={() => updateZoom(zoom - ZOOM_STEP)}
                className="cursor-pointer border border-[#555] px-3 py-2.5 text-sm font-semibold transition hover:border-[#f2b84b] hover:text-[#f2b84b] disabled:cursor-wait disabled:opacity-50 disabled:hover:border-[#555] disabled:hover:text-white"
              >
                -
              </button>
              <button
                type="button"
                disabled={isMapSwitching}
                onClick={resetView}
                className="cursor-pointer border border-[#555] px-3 py-2.5 text-sm font-semibold transition hover:border-[#f2b84b] hover:text-[#f2b84b] disabled:cursor-wait disabled:opacity-50 disabled:hover:border-[#555] disabled:hover:text-white"
              >
                1x
              </button>
              <button
                type="button"
                disabled={isMapSwitching}
                onClick={() => updateZoom(zoom + ZOOM_STEP)}
                className="cursor-pointer border border-[#555] px-3 py-2.5 text-sm font-semibold transition hover:border-[#f2b84b] hover:text-[#f2b84b] disabled:cursor-wait disabled:opacity-50 disabled:hover:border-[#555] disabled:hover:text-white"
              >
                +
              </button>
            </div>

            <button
              type="button"
              disabled={isMapSwitching}
              onClick={() => setPoints([])}
              className="mt-4 w-full cursor-pointer border border-[#555] px-3 py-2.5 text-sm font-semibold transition hover:border-[#f2b84b] hover:text-[#f2b84b] disabled:cursor-wait disabled:opacity-50 disabled:hover:border-[#555] disabled:hover:text-white"
            >
              Reset markers
            </button>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {MAPS.map((gameMap) => {
                const isSelected = gameMap.name === selectedMap.name;

                return (
                  <button
                    key={gameMap.name}
                    type="button"
                    disabled={isMapSwitching}
                    onClick={() => handleMapChange(gameMap)}
                    className={`cursor-pointer border px-3 py-2.5 text-sm font-semibold transition ${
                      isSelected
                        ? "border-[#f2b84b] bg-[#2a2418] text-[#f2b84b]"
                        : "border-[#555] text-white hover:border-[#f2b84b] hover:text-[#f2b84b]"
                    } disabled:cursor-wait disabled:opacity-50`}
                  >
                    {gameMap.name}
                  </button>
                );
              })}
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

function Metric({
  label,
  value,
  isPrimary = false,
}: {
  label: string;
  value: string;
  isPrimary?: boolean;
}) {
  return (
    <div className="border border-[#3d3d3d] bg-[#1b1b1b] p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9b9b9b]">
        {label}
      </p>
      <p
        className={`mt-2 font-bold ${
          isPrimary ? "text-2xl text-[#f2b84b]" : "text-base text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
