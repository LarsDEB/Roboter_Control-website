import { state } from './state.js';

export function createJoystick(canvas) {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  const ctx = canvas.getContext('2d');
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--knob-bg');

  const center = {
    x: canvas.width * 0.5,
    y: canvas.height * 0.5,
  };

  const knobRadius = canvas.width * 0.25;

  return {
    canvas: canvas,
    ctx: ctx,

    knobRadius: knobRadius,
    maxDist: canvas.width * 0.5 - knobRadius,

    center: center,

    pointer: {
      x: center.x,
      y: center.y,
    },

    position: {
      x: center.x,
      y: center.y,
    },

    normalized: {
      x: 0,
      y: 0,
      magnitude: 0,
    },

    active: false,
    pointerId: null,
  };
}

export function getJoystickByPointerId(pointerId) {
  const objects = Object.values(state);
  const joystick = objects.find((e) => {
    return e.pointerId === pointerId;
  });
  return joystick;
}

export function updateJoysticks() {
  const joysticks = Object.values(state);
  joysticks.forEach((joystick) => {
    updateJoystick(joystick);
  });
}

function updateJoystick(joystick) {
  const pointer = joystick.pointer;
  const center = joystick.center;

  // calc distance to center
  const dx = pointer.x - center.x;
  const dy = pointer.y - center.y;

  const dist = Math.hypot(dx, dy);

  // get max distance
  const max = joystick.maxDist;

  let x = dx;
  let y = dy;

  // maintain direction but stay in the joystick
  if (dist > max) {
    x = (dx / dist) * max;
    y = (dy / dist) * max;
  }

  // set new knob position
  joystick.position.x = center.x + x;
  joystick.position.y = center.y + y;

  // normalize (-1 to 1) and magnitude (0 to 1 (displays how far away the knob is))
  const normX = x / max;
  const normY = y / max;

  joystick.normalized.x = normX;
  joystick.normalized.y = normY;
  joystick.normalized.magnitude = Math.hypot(normX, normY);
}
