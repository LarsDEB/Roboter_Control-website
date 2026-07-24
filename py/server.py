import asyncio
import json
import websockets

PORT = 8008


async def client(ws):

    try:
        async for message in ws:
            data = json.loads(message)

            match data["type"]:
                case "connect":
                    print("Controller verbunden")

                case "move":
                    drive(data["move"], data["turn"])

    finally:
        print("Controller getrennt")
        drive({"x": 0, "y": 0, "magnitude": 0}, {"x": 0, "y": 0, "magnitude": 0})


async def main():
    async with websockets.serve(client, "0.0.0.0", PORT):
        print(f"WebSocket Server läuft auf ws://localhost:{PORT}")
        await asyncio.Future()


def drive(move, turn):
    vx = move["x"]
    vy = -move["y"]
    omega = turn["x"]

    fl = vy + vx + omega
    fr = vy - vx - omega
    rl = vy - vx + omega
    rr = vy + vx - omega

    values = [fl, fr, rl, rr]
    maximum = max(1, *(abs(v) for v in values))
    fl /= maximum
    fr /= maximum
    rl /= maximum
    rr /= maximum

    setMotors(fl, fr, rl, rr)


def _apply(motor, value):
    speed = int((value) * 512)
    motor.set_speed(speed)
    motor.start()


def setMotors(fl, fr, rl, rr):
    _apply(front_left, fl)
    _apply(front_right, -fr)
    _apply(rear_left, rl)
    _apply(rear_right, -rr)


asyncio.run(main())
