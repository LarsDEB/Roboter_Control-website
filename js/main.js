import { state } from './state.js';
import { update } from './update.js';
import { ipInputHandler, pointerDown, pointerMove, pointerUp } from './input.js';
import { render } from './render.js';
import { connect, server } from './server.js';

const connectForm = document.querySelector('#connectForm');

function init() {}

function sequence() {
    update();
    render();
    server();
  requestAnimationFrame(sequence);
}

// eventListeners
connectForm.addEventListener('submit', ipInputHandler);
window.addEventListener('pointerdown', pointerDown);
window.addEventListener('pointermove', pointerMove);
window.addEventListener('pointerup', pointerUp);

//run
init();
requestAnimationFrame(sequence);
