import { state } from './state.js';

let ws = null; // global websocket variable
let prevMessage = null; // global variable  to check if the new message is different to the previous message

export function server() {
  if (state.server.connected && state.controlling) sendControlMessage();
}

function isValidIPv4(ip) {
  if (ip === 'localhost') return true;

  const re =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

  return re.test(ip);
}

export function connect() {
  const ip = state.server.controllerIp;
  if (!isValidIPv4(ip)) {
    console.log('incorrectIP');
    state.overlays.connectOverlay.elements.status.text = 'incorrectIP';
    return;
  }

  ws = new WebSocket(`ws://${ip}:8008`);
  state.overlays.connectOverlay.elements.status.text = 'connecting';

  ws.onopen = () => {
    ws.send(JSON.stringify({ type: 'connect' }));
    state.server.connected = true;
    state.overlays.connectOverlay.elements.status.text = 'connected';
  };

  ws.onmessage = (event) => {
    console.log('Antwort:', event.data);
  };

  ws.onclose = () => {
    state.overlays.connectOverlay.elements.status.text = 'disconnected';
    state.server.connected = false;
    console.log('Verbindung geschlossen');
    ws = null;
  };
}

function sendControlMessage() {
  const joystickMove = state.joysticks.move.normalized;
  const joystickturn = state.joysticks.turn.normalized;

  const objekt = {
    type: 'move',
    move: joystickMove,
    turn: joystickturn,
  };

  const message = JSON.stringify(objekt);

  if (prevMessage !== message) {
    ws.send(message);
    prevMessage = message;
  }
}
