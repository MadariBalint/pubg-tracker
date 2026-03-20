import type { RootState } from "../../app/store";

export const selectTeams = (state: RootState) => state.tracker.teams;
export const selectMode = (state: RootState) => state.tracker.mode;
export const selectMaxTeams = (state: RootState) => state.tracker.maxTeams;
export const selectMaxPlayersPerTeam = (state: RootState) =>
  state.tracker.maxPlayersPerTeam;

export const selectAlivePlayersTotal = (state: RootState) =>
  state.tracker.teams.reduce((sum, team) => sum + team.alivePlayers, 0);

export const selectAliveTeamsTotal = (state: RootState) =>
  state.tracker.teams.filter((team) => team.alivePlayers > 0).length;
