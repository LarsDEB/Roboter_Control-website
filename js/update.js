import { state } from './state.js';

export function update() {
  updateJoysticks();
  updateOverlays();
}

function updateOverlays() {
  if (!state.server.connected) {
    state.controlling = false;

    state.overlays.connectOverlay.visible = true;
    state.overlays.connectOverlay.elements.connectBtn.text = 'Controller Verbinden';

    state.overlays.controlStopOverlay.visible = false;
    state.overlays.controlStopOverlay.elements.connection.text = 'Controller Verbinden';

    state.overlays.controlOverlay.visible = false;

  } else if (state.server.connected) {
    if (state.controlling) return;

    state.overlays.connectOverlay.visible = false;
    state.overlays.connectOverlay.elements.connectBtn.text = 'Controller trennen';

    state.overlays.controlStopOverlay.visible = true;
    state.overlays.controlStopOverlay.elements.connection.text = 'Controller trennen';

    state.overlays.controlOverlay.visible = true;
    
  }
}

function updateJoysticks() {
  const joysticks = Object.values(state.joysticks);
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
