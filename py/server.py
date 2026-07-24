import asyncio
import json
import websockets
from drive import drive

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
        drive({x: 0, y: 0, magnitude: 0}, {x: 0, y: 0, magnitude: 0})


async def main():
    async with websockets.serve(client, "0.0.0.0", PORT):
        print(f"WebSocket Server läuft auf ws://localhost:{PORT}")
        await asyncio.Future()


asyncio.run(main())
