import asyncio
import websockets
import json

PORT = 8008

def move(msData):
    print('moving')
    return True

def stop():
    print('stop')
    return True

def connectMessage():
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
            print('Empfangen:', msData['command'])
 
            action = commandHandler[msData['command']](msData)
            if action != True:
                await ws.send(json.dumps({'status': 'error'}))
            else:
                await ws.send(json.dumps({'status': 'ok'}))

    except websockets.exceptions.ConnectionClosed:
        print('Client getrennt')

async def main():
    async with websockets.serve(connect, "localhost", PORT):
        print(f"WebSocket Server läuft auf ws://localhost:{PORT}")
        await asyncio.Future() # runs forever

asyncio.run(main())


