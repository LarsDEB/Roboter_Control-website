// global variables
const connectOverlay = document.querySelector('#connectOverlay');
const connectStatus = document.querySelector('#connectStatus');
const connectBtn = document.querySelector('#connectBtn');
const deviceList = document.querySelector('#deviceList');
const nearbyDevices = document.querySelector('#nearbyDevices');

const controlStopOverlay = document.querySelector('#controlStopOverlay');
const play = document.querySelector('#play');
const controlSettings = document.querySelector('#controlSettings');
const changeDevice = document.querySelector('#controlSettings');
const disconnectDevice = document.querySelector('#disconnectDevice');

const controlOverlay = document.querySelector('#controlOverlay');
const joystickMove = document.querySelector('#joystickMoveCanvas');
const joystickTurn = document.querySelector('#joystickTurnCanvas');
const joystickState = {
  active: false,
  canvas: null,

  knobRadius: 0,

  position: {
    x: 0,
    y: 0,
  },

  normalizedPos: {
    x: 0,
    y: 0,
  },
};

const camVideo = document.querySelector('#camVideo');

let ws = null; // will be changed if connected to controller

// general functions
function init() {
  canvasSetNorm();
}

// joysticks
window.addEventListener('pointerdown', pointerDown);
window.addEventListener('pointermove', pointerMove);
window.addEventListener('pointerup', pointerUp);

function pointerDown(event) {
  const e = event.target;

  if (e.id === 'joystickMoveCanvas' || e.id === 'joystickTurnCanvas') {
    e.classList.add('active');
    joystickState.canvas = e;
    getKnobPos(event);
    drawKnob();
  }
}

function pointerMove(event) {
  if (!joystickState.canvas) return;
  getKnobPos(event);
  drawKnob();
}

function pointerUp(event) {
  const e = event.target;
  if (!joystickState.canvas) return;
  drawKnob(joystickState.canvas.width * 0.5, joystickState.canvas.height * 0.5);
  joystickState.canvas.classList.remove('active');
  joystickState.canvas = null;
}

function getKnobPos(event) {
  const rect = joystickState.canvas.getBoundingClientRect();
  const x = event.clientX - rect.left; // x cords in canvas
  const y = event.clientY - rect.top;

  const centerX = joystickState.canvas.width * 0.5; // x center of canvas
  const centerY = joystickState.canvas.height * 0.5;

  let dX = x - centerX; // distance of x to center
  let dY = y - centerY;

  const dist = Math.hypot(dX, dY); // distance to center

  const max = joystickState.canvas.width * 0.5 - joystickState.knobRadius;

  if (dist > max) {
    dX = (dX / dist) * max;
    dY = (dY / dist) * max;
  }

  const knobX = centerX + dX;
  const knobY = centerY + dY;

  joystickState.position.x = knobX;
  joystickState.position.y = knobY;

  const normX = dX / max; // for controller
  const normY = dY / max;

  joystickState.normalizedPos.x = normX;
  joystickState.normalizedPos.y = normY;
}

function canvasSetNorm() {
  [joystickMove, joystickTurn].forEach((e) => {
    e.width = e.offsetWidth;
    e.height = e.offsetHeight;
    joystickState.knobRadius = joystickMove.width * 0.25;
    drawKnob(e.width * 0.5, e.height * 0.5, e);
  });
}

function drawKnob(posX, posY, e) {
  if (!e) {
    e = joystickState.canvas;
  }
  if (!posX) posX = joystickState.position.x;
  if (!posY) posY = joystickState.position.y;

  const ctx = e.getContext('2d');
  ctx.clearRect(0, 0, e.width, e.height);
  ctx.beginPath();
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--knob-bg');
  ctx.arc(posX, posY, joystickState.knobRadius, 0, Math.PI * 2);
  ctx.fill();
}

// server
connectBtn.addEventListener('click', () =>
  send({ command: 'move', direction: 'forward', speed: 256 })
);

async function searchDevices() {
  connectStatus.textContent = '🔄 Suche nach Geräten...';
  try {
    const device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
    });
    connectStatus.textContent = `✅ Verbunden mit ${device.name}`;
  } catch {}
}

function connect() {
  ws = new WebSocket('ws://localhost:8008');

  ws.onopen = () => {
    console.log('Verbunden');
    ws.send(JSON.stringify({ command: 'connect' }));
  };

  ws.onmessage = (event) => {
    console.log('Antwort:', event.data);
  };

  ws.onclose = () => {
    console.log('Verbindung geschlossen');
    ws = null;
  };
}

function send(message) {
  if (!ws) return;
  ws.send(JSON.stringify(message));
}

// run
init();

