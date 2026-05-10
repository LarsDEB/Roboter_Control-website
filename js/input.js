import { state } from './state.js';
import { getJoystickByPointerId } from './joystick.js';

export function pointerDown(event) {
  const canvas = event.target.closest('canvas');
  const joystick = state[canvas?.id];

  if (!joystick) return;

  joystick.active = true;
  joystick.pointerId = event.pointerId;
  // setPointerCapture(event.pointerId);

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
