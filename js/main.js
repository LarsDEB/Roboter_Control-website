import { state } from './state.js';
import { createJoystick, updateJoysticks } from './joystick.js';
import { pointerDown, pointerMove, pointerUp } from './input.js';
import { renderJoysticks } from './render.js';
import { connect, sendControlMessage } from './server.js';

function init() {
  const jsMove = document.querySelector('#joystickMoveCanvas');
  const jsTurn = document.querySelector('#joystickTurnCanvas');
  state[jsMove.id] = createJoystick(jsMove);
  state[jsTurn.id] = createJoystick(jsTurn);
}

function sequence() {
  update();
  render();
  server();
  requestAnimationFrame(sequence);
}

function update() {
  updateJoysticks();
}

function render() {
  renderJoysticks();
}

function server() {}

// eventListeners
window.addEventListener('pointerdown', pointerDown);
window.addEventListener('pointermove', pointerMove);
window.addEventListener('pointerup', pointerUp);

//run
init();
requestAnimationFrame(sequence);
