import { state } from './state.js';
import { update } from './update.js';
import {
  ipInputHandler,
  pointerDown,
  pointerMove,
  pointerUp,
  connectButtonHandler,
  keyDown,
  keyUp,
} from './input.js';
import { render } from './render.js';
import { server } from './server.js';

const connectForm = document.querySelector('#connectForm');
const connectionBtn = document.querySelector('#connection');
const playBtn = document.querySelector('#play');

function init() {
  state.dirty = true;
  tick();
}

function tick() {
  update();

  if (state.dirty) {
    render();
    state.dirty = false;
  }

  server();

  requestAnimationFrame(tick);
}

connectForm.addEventListener('submit', ipInputHandler);
connectionBtn.addEventListener('click', connectButtonHandler);
playBtn.addEventListener('click', () => {
  state.controlling = true;
  state.dirty = true;
});

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);
window.addEventListener('pointerdown', pointerDown);
window.addEventListener('pointermove', pointerMove);
window.addEventListener('pointerup', pointerUp);

init();
