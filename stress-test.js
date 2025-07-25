// https://grafana.com/docs/k6/latest/javascript-api/k6-experimental/websockets/

import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.1.0/index.js';
import { WebSocket } from 'k6/experimental/websockets';
import { sleep } from 'k6';

const sessionDuration = 10000; // user session between 1s and 3s

export default function () {
  for (let i = 0; i < 4; i++) {
    startWSWorker(i);
  }
  sleep(20);
}

function startWSWorker(id) {
  // create a new websocket connetion
  console.log('워커 ID: ', id);
  const roomId = '019825d4-46e6-75c0-8aa9-4be52547efaf';
  const ws = new WebSocket('ws://localhost:8000');
  ws.binaryType = 'arraybuffer';

  ws.addEventListener('open', () => {
    console.log('WebSocket connection opened.');

    ws.addEventListener('message', (event) => {
      let data;
      console.log('event.data: ', event.data);
      try {
        data =
          typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
      } catch (e) {
        console.error('Invalid JSON:', event.data);
        return;
      }

      if (data.event === 'ready') {
        console.log('data.event: ', data.event);
        console.log('Received ready event. Sending join-rooms...');
        const subscribedRooms = [roomId];
        ws.send(
          JSON.stringify({
            event: 'join-rooms',
            data: subscribedRooms,
          }),
        );
      } else {
        console.log('Unknown event: ', data);
      }
    });

    // send a message every 2-8 seconds
    console.log(
      'ws.readyState:',
      `🕒 ${id}번 워커 setInterval 시작 예정 ${ws.readyState}`,
    );
    const intervalId = setInterval(
      () => {
        try {
          const message = `VU ${__VU}:${id}`;
          console.log('message: ', message);
          ws.send(
            JSON.stringify({
              event: 'send-message',
              data: {
                room: roomId,
                message: JSON.stringify({
                  roomId,
                  message: message,
                }),
              },
            }),
          );
        } catch (e) {
          console.error('💥 setInterval error:', e);
        }
      },
      randomIntBetween(500, 1000),
    );

    // after a sessionDuration stop sending message and leave the room
    const timeout1id = setTimeout(function () {
      console.log('intervalId: ', intervalId);
      clearInterval(intervalId);
      console.log(
        `VU ${__VU}:${id}: ${sessionDuration}ms passed, leaving the chat`,
      );
    }, sessionDuration);

    // after a seesionDuration + 3s close the connection
    const timeout2id = setTimeout(function () {
      console.log(`Closing the socket forcefully 3s after graceful LEAVE`);
      ws.close();
    }, sessionDuration + 3000);

    // when connection is closing, clean up the previously created timers
    ws.addEventListener('close', () => {
      clearTimeout(timeout1id);
      clearTimeout(timeout2id);
      console.log(`VU ${__VU}:${id}: disconnected`);
    });
  });
}
