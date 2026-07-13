import { state } from './state.js';

let ws = null;
let prevMessage = '';

function isValidIPv4(ip) {
  if (ip === 'localhost') return true;

  const re =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

  return re.test(ip);
}

export function connect() {
  const ip = state.server.controllerIp || window.location.hostname;

  if (!isValidIPv4(ip) && ip !== window.location.hostname) {
    state.overlays.connectOverlay.elements.status.text = 'incorrectIP';
    state.dirty = true;
    return;
  }

  if (ws) ws.close(1000, "reconnect");

  ws = new WebSocket(`ws://${ip}:8008`);
  state.overlays.connectOverlay.elements.status.text = 'connecting';
  state.dirty = true;

  ws.onopen = () => {
    ws.send(JSON.stringify({ type: 'connect' }));
    state.server.connected = true;
    state.overlays.connectOverlay.elements.status.text = 'connected';
    state.dirty = true;
  };

  ws.onmessage = (event) => {
    console.log('Antwort:', event.data);
  };

  ws.onclose = () => {
    console.log("disconnected")
    state.overlays.connectOverlay.elements.status.text = 'disconnected';
    state.server.connected = false;
    state.controlling = false;
    ws = null;
    state.dirty = true;
  };
}

export function disconnect() {
  if (ws) {
    ws.close(1000, 'User clicked "disconnect"');
  }
}

export function server() {
  if (!state.server.connected || !state.controlling || !ws) return;

  const joystickMove = state.joysticks.move.normalized;
  const joystickTurn = state.joysticks.turn.normalized;

  const obj = {
    type: 'move',
    move: joystickMove,
    turn: joystickTurn,
  };

  const message = JSON.stringify(obj);

  if (prevMessage !== message) {
    ws.send(message);
    prevMessage = message;
  }
}
