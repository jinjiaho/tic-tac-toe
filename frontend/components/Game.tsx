import React from "react";
import classnames from "classnames";
import { GameState, OXPlayers, Player } from "../interfaces.ts";
import Grid from "./Grid";
import styles from "../styles/Game.module.css";

interface IGame {
  game: GameState;
  watchers: string[];
  players: Player[];
  username: string;
  onMove: (cell: number) => void;
  onNewGame: () => void;
}

const Game: React.FC<IGame> = ({
  game,
  watchers,
  players,
  username,
  onMove,
  onNewGame,
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
      <div className={styles.header}>
        <h1>{message}</h1>
      </div>
      <div className={styles.scoreboard}>
        <h4>Scoreboard</h4>
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
        <h4>Watching ({watchers.length}):</h4>
        {watchers.length > 0 &&
          watchers.map((watcher, i) => (
            <div key={`watcher_${i}`}>{watcher}</div>
          ))}
      </div>
      <div className={styles.game}>
        <Grid
          isTurn={isPlayerTurn()}
          status={game.status}
          last={game.lastMove}
          playerSymbol={playerSymbols[username]}
          onMove={onMove}
        />
        {game.ended &&
          (isPlayer() ? (
            <div className={styles.newGame} onClick={onNewGame}>
              New Game
            </div>
          ) : (
            <h4>Waiting for new game...</h4>
          ))}
      </div>
    </div>
  );
};

export default Game;
