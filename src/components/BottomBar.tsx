import { useAppSelector } from "../app/hooks";
import {
  selectAlivePlayersTotal,
  selectAliveTeamsTotal,
} from "../features/tracker/trackerSelector";

export default function BottomBar() {
  const alivePlayers = useAppSelector(selectAlivePlayersTotal);
  const aliveTeams = useAppSelector(selectAliveTeamsTotal);
  return <div></div>;
}
