import { Observable } from 'rxjs';
import authServiceInstance from '../auth/auth.service';

let websocketObservable: Observable<any> | undefined = undefined;

function connect(bearerToken: string, route: string): Promise<WebSocket> {
  return new Promise((resolve) => {
    let ws = new WebSocket(
      `${window.env.WS_URI}${route}?Authorization=${encodeURI(`Bearer ${bearerToken}`)}`,
    );
    const interval = setInterval(() => {
      if (ws.readyState !== WebSocket.CONNECTING) {
        clearInterval(interval);
        resolve(ws);
      }
    }, 50);
  });
}

function tryConnect(
  bearerToken: string,
  route: string,
  attempts: number,
): Promise<WebSocket> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      connect(bearerToken, route).then((ws) => {
        if (ws.readyState !== WebSocket.OPEN) {
          reject();
        } else {
          resolve(ws);
          attempts = 0;
        }
      });
    }, Math.min(Math.pow(attempts, 2), 10) * 1000);
  });
}

async function createWebSocket() {
  const bearerToken = await authServiceInstance.getBearerToken();

  let attempts = 0;
  let websocket: WebSocket | undefined;
  while (!websocket || websocket.readyState !== WebSocket.OPEN) {
    try {
      if (attempts > 0)
        console.info(`Websocket connection attempt #${attempts + 1}`);
      websocket = await tryConnect(bearerToken, '/ws', attempts);
    } catch (e) {}
    attempts += 1;
  }
  if (attempts > 1) console.info('Websocket connection successful');

  websocket.onclose = function () {
    console.warn('Websocket connection lost');
    initialiseWebSocketObservable();
  };
  return websocket;
}

function initialiseWebSocketObservable() {
  websocketObservable = new Observable((observer) => {
    const onMessage = function (event: { data: string }) {
      const parsed = JSON.parse(event.data);
      observer.next(parsed);
    };
    const reconnect = function () {
      createWebSocket()
        .then((websocket) => {
          websocket.onmessage = onMessage;
          websocket.onclose = reconnect;
        })
        .catch((err) => observer.error(err));
    };
    reconnect();
  });
}

export function getWebSocketObservable(): Observable<any> {
  if (!websocketObservable) {
    initialiseWebSocketObservable();
  }
  return websocketObservable as Observable<any>;
}
