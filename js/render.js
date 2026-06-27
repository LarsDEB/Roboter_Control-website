import { state } from './state.js';

export function render() {
  console.log('render')
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

  overlay.elements.ipInput.element.value = state.server.controllerIp;

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
  const joysticks = Object.values(state.joysticks);
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
