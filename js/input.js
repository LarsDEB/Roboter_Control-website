import { state } from './state.js';
import { connect, disconnect } from './server.js';

function markDirty() {
  state.dirty = true;
}

export function keyDown(event) {
  if (!state.controlling && event.code !== 'Escape') return;

  switch (event.code) {
    case 'Escape':
      if (state.controlling) {
        state.controlling = false;
        resetControls();
      } else {
        state.controlling = true;
      }
      markDirty();
      break;

    case 'KeyW':
    case 'ArrowUp':
      state.keyboard.up = true;
      break;

    case 'KeyS':
    case 'ArrowDown':
      state.keyboard.down = true;
      break;

    case 'KeyA':
    case 'ArrowLeft':
      state.keyboard.left = true;
      break;

    case 'KeyD':
    case 'ArrowRight':
      state.keyboard.right = true;
      break;

    default:
      return;
  }

  markDirty();
}

export function keyUp(event) {
  switch (event.code) {
    case 'KeyW':
    case 'ArrowUp':
      state.keyboard.up = false;
      break;

    case 'KeyS':
    case 'ArrowDown':
      state.keyboard.down = false;
      break;

    case 'KeyA':
    case 'ArrowLeft':
      state.keyboard.left = false;
      break;

    case 'KeyD':
    case 'ArrowRight':
      state.keyboard.right = false;
      break;

    default:
      return;
  }

  markDirty();
}

function resetControls() {
  state.keyboard.up = false;
  state.keyboard.down = false;
  state.keyboard.left = false;
  state.keyboard.right = false;

  Object.values(state.joysticks).forEach((joystick) => {
    joystick.active = false;
    joystick.pointerId = null;
    joystick.pointer = { ...joystick.center };
  });

  markDirty();
}

export function ipInputHandler(event) {
  event.preventDefault();

  const ipInput = event.target.elements.controllerIp;
  const ip = ipInput.value.trim();

  if (ip.length > 1) {
    state.server.controllerIp = ip;
    ipInput.value = '';
  } else {
    state.server.controllerIp = window.location.hostname;
  }

  connect();
  markDirty();
}

export function pointerDown(event) {
  const canvas = event.target.closest('canvas');
  const joystick = getJoystickByCanvas(canvas);
  if (!joystick) return;

  joystick.active = true;
  joystick.pointerId = event.pointerId;

  const rect = joystick.canvas.getBoundingClientRect();
  joystick.pointer = {
    x: event.clientX - rect.x,
    y: event.clientY - rect.y,
  };

  joystick.canvas.setPointerCapture?.(event.pointerId);
  markDirty();
}

export function pointerMove(event) {
  const joystick = getJoystickByPointerId(event.pointerId);
  if (!joystick) return;

  const rect = joystick.canvas.getBoundingClientRect();
  joystick.pointer = {
    x: event.clientX - rect.x,
    y: event.clientY - rect.y,
  };

  markDirty();
}

export function pointerUp(event) {
  const joystick = getJoystickByPointerId(event.pointerId);
  if (!joystick) return;

  joystick.pointer = { x: joystick.center.x, y: joystick.center.y };
  joystick.pointerId = null;
  joystick.active = false;

  joystick.canvas.releasePointerCapture?.(event.pointerId);
  markDirty();
}

export function connectButtonHandler() {
  if (state.server.connected) {
    disconnect();
  } else {
    connect();
  }
  markDirty();
}

function getJoystickByPointerId(pointerId) {
  return Object.values(state.joysticks).find((e) => e.pointerId === pointerId) || null;
}

function getJoystickByCanvas(canvas) {
  return Object.values(state.joysticks).find((joystick) => joystick.canvas === canvas) || null;
}
