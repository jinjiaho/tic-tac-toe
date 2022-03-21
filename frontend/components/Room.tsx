import React from "react";
import { NewRoundRequest, RoomInitRequest, RoomState } from "../interfaces.ts";
import { GameEndMessage } from "../interfaces.ts/websocket";
import Game from "./RoomComponents/Game";
import GameEnd from "./RoomComponents/GameEnd";
import Waiting from "./RoomComponents/Waiting";

interface IRoom {
  roomId: string;
  username: string;
  onLeaveRoom: (gameEnded: boolean) => void;
}

const Room: React.FC<IRoom> = ({ roomId, username, onLeaveRoom }) => {
  const [websocket, setWebsocket] = React.useState<WebSocket>();
  const [roomState, setRoomState] = React.useState<RoomState>();
  const [gameEnd, setGameEnd] = React.useState<GameEndMessage>();

  const handleMove = (cell: number) => {
    if (websocket) {
      const data = {
        event: "move",
        params: {
          cell,
          roomId,
          username,
        },
      };
      websocket.send(JSON.stringify(data));
    }
  };

  const handleLeave = (gameEnded: boolean) => {
    if (websocket) {
      websocket.close();
      onLeaveRoom(gameEnded);
    }
  };

  const newRound = () => {
    if (websocket) {
      const data: NewRoundRequest = {
        event: "new game",
        params: {
          roomId,
        },
      };
      websocket.send(JSON.stringify(data));
    }
  };

  const connect = (websocket: WebSocket) => {
    if (websocket) {
      websocket.onerror = function (e: any) {
        console.log(`Websocket error: ${e.data}`);
        websocket.close();
      };

      websocket.onopen = function (e: any) {
        console.log(`Websocket connection established: ${e.data}`);
        const data: RoomInitRequest = {
          event: "init",
          params: {
            roomId,
            username,
          },
        };
        websocket.send(JSON.stringify(data));
      };

      websocket.onmessage = function (e: any) {
        console.log(`Websocket message: ${e.data}`);
        const data = JSON.parse(e.data);
        console.log(data.event, typeof data.data);
        switch (data.event) {
          case "status":
            setRoomState(data.data);
            break;
          case "game end":
            setGameEnd(data.data);
        }
      };

      websocket.onclose = function (e: any) {
        console.log("Socket closed. Reconnect in 1s...");
        setTimeout(function () {
          if (websocket) {
            connect(websocket);
          }
        }, 1000);
      };
    }
  };

  React.useEffect(() => {
    setWebsocket(new WebSocket("ws://localhost:8000"));

    // window.onbeforeunload = function () {
    //   return "Are you sure you want to leave?";
    // };

    window.onunload = function () {
      if (websocket) {
        websocket.close();
      }
    };
  }, []);

  React.useEffect(() => {
    if (websocket) {
      connect(websocket);
    }
  }, [websocket]);

  // React.useEffect(() => {
  //   console.log("ROOM STATE", roomState);
  // }, [roomState]);

  return (
    <>
      {roomState ? (
        gameEnd === undefined ? (
          <div>
            {roomState.players.length < 2 ? (
              <Waiting roomId={roomId} onLeaveRoom={() => handleLeave(true)} />
            ) : (
              <Game
                game={roomState.game}
                watchers={roomState.watchers}
                players={roomState.players}
                username={username}
                onMove={handleMove}
                onNewGame={newRound}
                onLeaveRoom={handleLeave}
              />
            )}
          </div>
        ) : (
          <GameEnd {...gameEnd} onBack={() => handleLeave(true)} />
        )
      ) : (
        <h1>Loading room...</h1>
      )}
    </>
  );
};

export default Room;
