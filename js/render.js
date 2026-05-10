import { state } from './state.js';

export function renderJoysticks() {
  const joysticks = Object.values(state);
  joysticks.forEach((e) => {
    renderJoystick(e);
  });
}

function renderJoystick(joystick) {
  const canvas = joystick.canvas;
  const ctx = joystick.ctx;

  const pos = joystick.position;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, joystick.knobRadius, 0, Math.PI * 2);
  ctx.fill();
}
