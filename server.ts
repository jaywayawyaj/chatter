import WebSocket, { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

interface Client extends WebSocket {
    isAlive?: boolean;
}

wss.on('connection', (ws: Client) => {
    console.log('Client connected')

    ws.isAlive = true;

    ws.on('message', (message: WebSocket.RawData) => {
        const msg = message.toString();
        console.log('Message from client', msg);

        wss.clients.forEach((client: Client) => {
            if (client.isAlive && client.readyState === WebSocket.OPEN) {
                client.send(msg);
            }
        })

        ws.on('close', () => {
            console.log('Client disconnected');
            ws.isAlive = false;
        })
    })

    ws.on('error', (error: Error) => {
        console.log('Error', error);
    })
})

wss.on('listening', () => {
    console.log('WebSocket server running on ws://localhost:8080');
  });

  wss.on('error', (error: Error) => {
    console.error('Server error:', error);
  });
