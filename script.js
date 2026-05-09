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

