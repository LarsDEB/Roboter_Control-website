export const state = {
  controlling: false,

  server: {
    connected: false,
    controllerIp: window.location.hostname,
  },

  overlays: {
    connectOverlay: {
      visible: true,

      element: document.querySelector('#connectOverlay'),

      elements: {
        status: {
          element: document.querySelector('#connectStatus'),
          text: '❌ Nicht verbunden',
        },

        form: {
          element: document.querySelector('#connectForm'),
        },

        ipInput: {
          element: document.querySelector('#ipInput'),
          value: '',
        },

        connectBtn: {
          element: document.querySelector('#connectBtn'),
          text: 'Controller verbinden',
          disabled: false,
        },
      },
    },

    controlOverlay: {
      visible: false,

      element: document.querySelector('#controlOverlay'),

      elements: {
        moveWrapper: document.querySelector('#joystickMove'),
        turnWrapper: document.querySelector('#joystickTurn'),
      },
    },

    controlStopOverlay: {
      visible: false,

      element: document.querySelector('#controlStopOverlay'),

      elements: {
        play: {
          element: document.querySelector('#play'),
          text: 'Fortsetzen',
        },

        settings: {
          element: document.querySelector('#controlSettings'),
          text: 'Einstellungen',
        },

        connection: {
          element: document.querySelector('#connection'),
          text: 'Controller verbinden',
        },
      },
    },
  },

  joysticks: {
    move: createJoystick(document.querySelector('#joystickMoveCanvas')),
    turn: createJoystick(document.querySelector('#joystickTurnCanvas')),
  },
};

function createJoystick(canvas) {
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
