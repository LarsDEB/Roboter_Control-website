import { state } from './state.js';

export function update() {
  updateJoysticks();
  updateOverlays();
}

function updateOverlays() {
  const prev = {
    controlling: state.controlling,
    connected: state.server.connected,
  };

  if (!state.server.connected) {
    state.controlling = false;
    state.overlays.connectOverlay.visible = true;
    state.overlays.connectOverlay.elements.connectBtn.text = 'Controller verbinden';
    state.overlays.controlStopOverlay.visible = false;
    state.overlays.controlStopOverlay.elements.connection.text = 'Controller verbinden';
    state.overlays.controlOverlay.visible = false;
  } else if (state.controlling) {
    state.overlays.connectOverlay.visible = false;
    state.overlays.connectOverlay.elements.connectBtn.text = 'Controller trennen';
    state.overlays.controlStopOverlay.visible = false;
    state.overlays.controlStopOverlay.elements.connection.text = 'Controller trennen';
    state.overlays.controlOverlay.visible = true;
  } else {
    state.overlays.connectOverlay.visible = false;
    state.overlays.connectOverlay.elements.connectBtn.text = 'Controller trennen';
    state.overlays.controlStopOverlay.visible = true;
    state.overlays.controlStopOverlay.elements.connection.text = 'Controller trennen';
    state.overlays.controlOverlay.visible = true;
  }

  if (prev.controlling !== state.controlling || prev.connected !== state.server.connected) {
    state.dirty = true;
  }
}

function updateJoysticks() {
  Object.values(state.joysticks).forEach(updateJoystick);
}

function updateJoystick(joystick) {
  if (joystick === state.joysticks.move && !joystick.active && joystick.pointerId === null) {
    const kb = state.keyboard;

    const x = (kb.right ? 1 : 0) - (kb.left ? 1 : 0);
    const y = (kb.down ? 1 : 0) - (kb.up ? 1 : 0);

    if (x !== 0 || y !== 0) {
      const len = Math.hypot(x, y);

      joystick.normalized.x = x / len;
      joystick.normalized.y = y / len;
      joystick.normalized.magnitude = 1;

      joystick.position.x = joystick.center.x + joystick.normalized.x * joystick.maxDist;

      joystick.position.y = joystick.center.y + joystick.normalized.y * joystick.maxDist;

      return;
    }
  }

  if (!joystick.active && joystick.pointerId === null) {
    joystick.position.x = joystick.center.x;
    joystick.position.y = joystick.center.y;
    joystick.normalized.x = 0;
    joystick.normalized.y = 0;
    joystick.normalized.magnitude = 0;
    return;
  }

  if (!joystick.active && joystick.pointerId === null) {
    joystick.position.x = joystick.center.x;
    joystick.position.y = joystick.center.y;
    joystick.normalized.x = 0;
    joystick.normalized.y = 0;
    joystick.normalized.magnitude = 0;
    return;
  }

  const dx = joystick.pointer.x - joystick.center.x;
  const dy = joystick.pointer.y - joystick.center.y;
  const dist = Math.hypot(dx, dy);
  const max = joystick.maxDist || 1;

  let x = dx;
  let y = dy;

  if (dist > max) {
    x = (dx / dist) * max;
    y = (dy / dist) * max;
  }

  joystick.position.x = joystick.center.x + x;
  joystick.position.y = joystick.center.y + y;

  const normX = x / max;
  const normY = y / max;

  joystick.normalized.x = normX;
  joystick.normalized.y = normY;
  joystick.normalized.magnitude = Math.hypot(normX, normY);
}
