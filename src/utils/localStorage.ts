import type { TrackerState } from "../features/tracker/trackerTypes";

const STORAGE_KEY = "pubg-tracker-state";

//Load from localStorage
export function loadState(): TrackerState | undefined {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return undefined;
    return JSON.parse(serialized) as TrackerState;
  } catch (error) {
    console.error("Failed to load state", error);
    return undefined;
  }
}

// Save to localStorage

export function saveState(state: TrackerState) {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.error("Failed to save state", error);
  }
}
