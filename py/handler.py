import asyncio
import websockets
import json

PORT = 8008;

def move(msData):
    print('moving')
    return True

def stop(msData):
    print('stop')
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
            print('Empfangen:', msData['type'])
 
            action = commandHandler[msData['type']](msData)
            if action != True:
                await ws.send(json.dumps({'status': 'error'}))
            else:
                await ws.send(json.dumps({'status': 'ok'}))

    except websockets.exceptions.ConnectionClosed:
        print('Client getrennt')

async def main():
    async with websockets.serve(connect, "0.0.0.0", PORT ):
        print(f"WebSocket Server läuft auf ws://localhost:{PORT}")
        await asyncio.Future() # runs forever

asyncio.run(main())


