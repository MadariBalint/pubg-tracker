import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { createAdditionalTeams, createTeams } from "../../data/createTeams";
import type { GameMode, TrackerState } from "./trackerTypes";

const initialState: TrackerState = {
  mode: "squad",
  maxPlayersPerTeam: 4,
  maxTeams: 25,
  teams: createTeams(16, 4, 1),
  startSlot: 1,
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
        state.teams = createTeams(16, 4, 1);
      } else {
        state.maxPlayersPerTeam = 2;
        state.maxTeams = 50;
        state.teams = createTeams(32, 2, 1);
      }
    },

    resetAllTeams(state) {
      state.teams.forEach((team) => {
        team.alivePlayers = state.maxPlayersPerTeam;
      });
    },

    addOneTeam(state) {
      if (state.teams.length >= state.maxTeams) return;
      const newTeams = createAdditionalTeams(
        state.teams.length,
        1,
        state.maxPlayersPerTeam,
        state.startSlot,
      );

      state.teams.push(...newTeams);
    },

    deleteTeam(state) {
      if (state.teams.length === 0) return;
      state.teams.pop();
    },

    setStartSlotToThree(state) {
      if (state.mode === "squad") {
        state.teams = createTeams(16, 4, 3);
        state.startSlot = 3;
      }
      if (state.mode === "duo") {
        state.teams = createTeams(32, 2, 3);
        state.startSlot = 3;
      }
    },

    setStartSlotToTwo(state) {
      if (state.mode === "squad") {
        state.teams = createTeams(16, 4, 2);
        state.startSlot = 2;
      }
      if (state.mode === "duo") {
        state.teams = createTeams(32, 2, 2);
        state.startSlot = 2;
      }
    },

    setStartSlotToOne(state) {
      if (state.mode === "squad") {
        state.teams = createTeams(16, 4, 1);
        state.startSlot = 1;
      }
      if (state.mode === "duo") {
        state.teams = createTeams(32, 2, 1);
        state.startSlot = 1;
      }
    },
  },
});

export const {
  decreaseAlivePlayers,
  increaseAlivePlayers,
  setMode,
  resetAllTeams,
  addOneTeam,
  deleteTeam,
  setStartSlotToThree,
  setStartSlotToTwo,
  setStartSlotToOne,
} = trackerSlice.actions;

export default trackerSlice.reducer;
