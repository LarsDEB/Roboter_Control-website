import asyncio
import websockets
import json

PORT = 8008

def move(msData):
    print('moving', msData)
    return True

def stop(msData):
    print('stop', msData)
    return True

def connectMessage(msData):
    print('Client verbunden')
    return True

commandHandler = {
    'move': move,
    'stop': stop,
    'connect': connectMessage,
}

async def connect(ws):
    try:
        async for message in ws:
            msData = json.loads(message)
            msg_type = msData.get('type')
            print('Empfangen:', msg_type)

            action = commandHandler.get(msg_type)
            if action is None:
                await ws.send(json.dumps({'status': 'error', 'reason': 'unknown_type'}))
                continue

            ok = action(msData)
            if ok:
                await ws.send(json.dumps({'status': 'ok'}))
            else:
                await ws.send(json.dumps({'status': 'error'}))

    finally:
        print('Client getrennt')

async def main():
    async with websockets.serve(connect, "0.0.0.0", PORT):
        print(f"WebSocket Server läuft auf ws://localhost:{PORT}")
        await asyncio.Future()

asyncio.run(main())