import { state } from './state.js';

export function render() {
  renderJoysticks();
  renderOverlays();
}

function renderOverlays() {
  renderConnectOverlay();
  renderControlOverlay();
  renderControlStopOverlay();
}

function renderConnectOverlay() {
  const overlay = state.overlays.connectOverlay;
  const overlayElement = overlay.element;
  overlayElement.classList.toggle('invisible', !overlay.visible);
  overlay.elements.status.element.textContent = getStatusText(overlay.elements.status.text);
  overlay.elements.connectBtn.element.textContent = overlay.elements.connectBtn.text;
}

function getStatusText(status) {
  const texts = {
    disconnected: '❌ Nicht verbunden',
    connecting: '🔄 Verbinden...',
    connected: '✅ Verbunden',
    incorrectIP: '⚠️ Ungültige IP-Adresse',
  };
  return texts[status] ?? status;
}

function renderControlOverlay() {
  const overlay = state.overlays.controlOverlay;
  overlay.element.classList.toggle('invisible', !overlay.visible);
}

function renderControlStopOverlay() {
  const overlay = state.overlays.controlStopOverlay;
  overlay.element.classList.toggle('invisible', !overlay.visible);
}

function renderJoysticks() {
  Object.values(state.joysticks).forEach(renderJoystick);
}

function renderJoystick(joystick) {
  const { canvas, ctx, position, knobRadius } = joystick;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(Math.round(position.x), Math.round(position.y), knobRadius, 0, Math.PI * 2);
  ctx.fill();
}
