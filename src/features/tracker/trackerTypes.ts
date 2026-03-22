export type Team = {
  id: number;
  slot: number;
  name: string;
  flag: string;
  alivePlayers: number;
};

export type GameMode = "squad" | "duo";

export type TrackerState = {
  mode: GameMode;
  maxPlayersPerTeam: number;
  maxTeams: number;
  startSlot: number;
  teams: Team[];
};
