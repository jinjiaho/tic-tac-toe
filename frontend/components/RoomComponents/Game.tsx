import React from "react";
import classnames from "classnames";
import { GameState, OXPlayers, Player } from "../../interfaces.ts";
import Grid from "./Grid";
import styles from "../../styles/Game.module.css";

interface IGame {
  game: GameState;
  watchers: string[];
  players: Player[];
  username: string;
  onMove: (cell: number) => void;
  onNewGame: () => void;
  onLeaveRoom: (ended: boolean) => void;
}

const Game: React.FC<IGame> = ({
  game,
  watchers,
  players,
  username,
  onMove,
  onNewGame,
  onLeaveRoom,
}) => {
  const getPlayerSymbols = () => {
    const symbolsMapping: OXPlayers = {};
    Object.keys(game.players).map((symbol) => {
      symbolsMapping[game.players[symbol]] = symbol;
    });
    return symbolsMapping;
  };

  const [turnPlayer, setTurnPlayer] = React.useState(game.players[game.turn]);
  const [playerSymbols, setPlayerSymbols] = React.useState(getPlayerSymbols());

  const isPlayerTurn = () => username === game.players[game.turn];

  const isPlayer = () => players.map((x) => x.username).includes(username);

  const getMessage = () => {
    if (game.ended) {
      // Somebody's turn
      if (game.win !== undefined) {
        if (game.win.player === username) {
          return `You win!`;
        }
        return `${game.win.player} wins!`;
      }
      return `It's a draw!`;
    } else {
      if (isPlayerTurn()) {
        return `Your turn`;
      }
      return `${turnPlayer}'s turn`;
    }
  };

  const [message, setMessage] = React.useState(getMessage());

  React.useEffect(() => {
    setPlayerSymbols(getPlayerSymbols());
  }, [game.round]);

  React.useEffect(() => {
    setTurnPlayer(game.players[game.turn]);
  }, [game.turn, game.round]);

  React.useEffect(() => {
    setMessage(getMessage());
  }, [turnPlayer, game.ended]);

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>{message}</h1>
      <div className={styles.inRoom}>
        <div className={styles.scoreboard}>
          <h2>Scoreboard</h2>
          <div className={styles.playerGrid}>
            {players.length > 0 &&
              players.map((player, i) => (
                <div className={styles.playerRow} key={`player_${i}`}>
                  <div
                    className={classnames(styles.playerCell, styles.playerName)}
                  >
                    {player.username} ({playerSymbols[player.username]})
                  </div>
                  <div className={styles.playerCell}>{player.score}</div>
                </div>
              ))}
          </div>
        </div>
        <div className={styles.audience}>
          <h2>Watching ({watchers.length}):</h2>
          {watchers.length > 0 &&
            watchers.map((watcher, i) => (
              <div key={`watcher_${i}`}>{watcher}</div>
            ))}
        </div>
      </div>
      <div className={styles.game}>
        <Grid
          isTurn={isPlayerTurn()}
          status={game.status}
          last={game.lastMove}
          playerSymbol={playerSymbols[username]}
          win={game.win}
          onMove={onMove}
        />
      </div>
      {game.ended &&
        (isPlayer() ? (
          <div className={styles.newGame} onClick={onNewGame}>
            New Game
          </div>
        ) : (
          <h4 className={styles.newGame}>Waiting for new game...</h4>
        ))}
      <div className={styles.leave}>
        <div
          className={styles.leaveRoom}
          onClick={() => onLeaveRoom(game.ended)}
        >
          Leave Room
        </div>
      </div>
    </div>
  );
};

export default Game;
