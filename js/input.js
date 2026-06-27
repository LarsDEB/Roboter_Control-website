import { state } from './state.js';
import { connect } from './server.js';

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
}

export function pointerMove(event) {
  const pointerId = event.pointerId;
  const joystick = getJoystickByPointerId(pointerId);

  if (!joystick) return;

  const rect = joystick.canvas.getBoundingClientRect();

  joystick.pointer = {
    x: event.clientX - rect.x,
    y: event.clientY - rect.y,
  };
}

export function pointerUp(event) {
  const pointerId = event.pointerId;
  const joystick = getJoystickByPointerId(pointerId);

  if (!joystick) return;

  const center = joystick.center;

  joystick.pointer = {
    x: center.x,
    y: center.y,
  };

  joystick.pointerId = null;
}

function getJoystickByPointerId(pointerId) {
  const joysticks = Object.values(state.joysticks);
  const joystick = joysticks.find((e) => {
    return e.pointerId === pointerId;
  });
  return joystick;
}

function getJoystickByCanvas(canvas) {
  return Object.values(state.joysticks).find((joystick) => joystick.canvas === canvas);
}
