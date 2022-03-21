/** Simple pub sub manager */

import { RoomInitRequest } from "./interfaces";
import { getRoom, leaveRoom } from "./redis";
import { isInRoom } from "./utils/room";
import { errorMessage, gameEndMessage, statusMessage } from "./utils/websocket";

interface Subscriber {
  username: string;
  connection: any;
}

interface Channels {
  [key: string]: Subscriber[];
}

class PubSubManager {
  constructor() {
    this.channels = {}
  }

  channels: Channels;

  subscribe = (subscriber: Subscriber, channel: string) => {
    let subscribers = this.channels[channel];
    if (!subscribers || subscribers === undefined) {
      this.createChannel(channel);
    }
    // make sure no double subscription
    if (!this.channels[channel].includes(subscriber)) {
      this.channels[channel].push(subscriber);
    }
    console.log(`${subscriber.username} SUBSCRIBED TO ${channel}`);
    return true;
  }

  
  createChannel = (channelName: string, message?: string) => {
    this.channels[channelName] = [];
    return true;
  }

  publish = (channel: string, message: string) => {
    const subscribers = this.channels[channel];
    if (subscribers && subscribers.length > 0) {
      subscribers.map(subscriber => {
        subscriber.connection.sendUTF(message);
      })
    }
    return true;
  }

  removeSubscriber = (connection: any) => {
    for (const channel in this.channels) {
      if (this.channels[channel] !== undefined) {
        const subscriber = this.channels[channel].find(x => x.connection === connection);
        console.log(`SUBSCRIBER LEAVING CHANNEL ${channel}: ${JSON.stringify(subscriber)}`)
        if (subscriber && subscriber.username) {
          leaveRoom(channel, subscriber.username).then(result => {
            console.log(`REMOVED SUBSCRIBER ${subscriber.username} FROM CHANNEL ${channel}`);
            this.channels[channel] = this.channels[channel].filter(x => x !== subscriber);
            // If contains game status, game is still ongoing
            if (result.game !== undefined && result.watchers !== undefined && result.players !== undefined) {
              this.publish(channel, statusMessage(result));
            } else {
              this.publish(channel, gameEndMessage(result, subscriber.username));
            }
          }).catch(err => {
            console.log(`ERROR LEAVING ROOM: ${err}`)
          })
        }
      }
    }
  }

  checkSubscribed = (channel: string, username: string) => {
    const channelObj = this.channels[channel];
    if (!channelObj || channelObj === undefined) {
      return false;
    }
    if (channelObj.find(x => x.username === username)) {
      console.log("CHECK SUBSCRIBED true")
      return true;
    }
    return false;
  }

}

const pubSubManager = new PubSubManager;

export default pubSubManager;