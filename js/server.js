import { state } from './state.js';

let ws = null;

export function connect() {
  ws = new WebSocket('//localhost8008/control');

  ws.onopen = () => {
    console.log('Verbunden');
    ws.send(JSON.stringify({ command: 'connect' }));
  };

  ws.onmessage = (event) => {
    console.log('Antwort:', event.data);
  };

  ws.onclose = () => {
    console.log('Verbindung geschlossen');
    ws = null;
  };
}

export function sendControlMessage() {
  while (!ws) connect(state.controlWsUrl);

  const joystickMove = state.joystickMoveCanvas.normalized;
  const joystickturn = state.joystickTurnCanvas.normalized;

  const message = {
    command: 'move',
    move: joystickMove,
    turn: joystickturn,
  };

  ws.send(JSON.stringify(message));
}
