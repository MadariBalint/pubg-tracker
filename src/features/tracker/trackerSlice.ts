import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { createTeams } from "../../data/createTeams";
import type { GameMode, TrackerState } from "./trackerTypes";

const initialState: TrackerState = {
  mode: "squad",
  maxPlayersPerTeam: 4,
  maxTeams: 25,
  teams: createTeams(25, 4),
};

const trackerSlice = createSlice({
  name: "tracker",
  initialState,
  reducers: {
    decreaseAlivePlayers(state, action: PayloadAction<number>) {
      const team = state.teams.find((t) => t.id === action.payload);

      if (!team) return;
      if (team.alivePlayers > 0) {
        team.alivePlayers -= 1;
      }
    },

    increaseAlivePlayers(state, action: PayloadAction<number>) {
      const team = state.teams.find((t) => t.id === action.payload);

      if (!team) return;
      if (team.alivePlayers < state.maxPlayersPerTeam) {
        team.alivePlayers += 1;
      }
    },

    setMode(state, action: PayloadAction<GameMode>) {
      state.mode = action.payload;

      if (action.payload === "squad") {
        state.maxPlayersPerTeam = 4;
        state.maxTeams = 25;
        state.teams = createTeams(25, 4);
      } else {
        state.maxPlayersPerTeam = 2;
        state.maxTeams = 5;
        state.teams = createTeams(50, 2);
      }
    },

    resetAllTeams(state) {
      state.teams.forEach((team) => {
        team.alivePlayers = state.maxPlayersPerTeam;
      });
    },
  },
});

export const {
  decreaseAlivePlayers,
  increaseAlivePlayers,
  setMode,
  resetAllTeams,
} = trackerSlice.actions;

export default trackerSlice.reducer;
