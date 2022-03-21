import { handleMove, handleNewConnection, handleNewGame } from './messageHandler';
import pubSubManager from './pubSubManager';
import { errorMessage } from './utils/websocket';

module.exports = function(wsServer) {
  wsServer.on('request', function(request) {
    const connection = request.accept(null, request.origin);

    connection.on('message', function(message) {
      console.log("Received Message:", message.utf8Data);
      const data = JSON.parse(message.utf8Data);
      const params = data.params;
      if (!params || !params.roomId) {
        const errMsg = errorMessage('Room ID needed');
        connection.sendUTF(errMsg);
        return;
      }
      switch (data.event) {
        case 'init':
          if (!params.username) {
            const errMsg = errorMessage('Username needed');
            connection.sendUTF(errMsg);
            return;
          }
          const subscribed = pubSubManager.checkSubscribed(params.roomId, params.username);
          if (subscribed) {
            console.log(`${params.username} ALREADY SUBSCRIBED TO ${params.roomId}`)
          } else {
            handleNewConnection(params, connection).then(msg => {
              pubSubManager.publish(params.roomId, msg)
            }).catch(err => {
              connection.sendUTF(err);
            })
          }
          break;
        case 'move':
          handleMove(params).then(msg => {
            pubSubManager.publish(params.roomId, msg)
          }).catch(err => {
            connection.sendUTF(err);
          })
          break;
        case 'new game':
          handleNewGame(params).then(msg => {
            pubSubManager.publish(params.roomId, msg);
          }).catch(err => {
            connection.sendUTF(err);
          });
      }
    });

    connection.on('close', function(reasonCode, description) {
      console.log('Client has disconnected', reasonCode, description);
      pubSubManager.removeSubscriber(connection);
    });
  })
}