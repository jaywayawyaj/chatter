interface ChatMessage {
    text: string;
    timestamp: number;
}

class ChatApp {
    private ws: WebSocket;
    private chatDiv: HTMLDivElement;
    private messageInput: HTMLInputElement;
    private sendButton: HTMLButtonElement;
    private logButton: HTMLButtonElement;

    constructor() {
        this.ws = new WebSocket("ws://localhost:8080");
        this.chatDiv = document.getElementById('chat') as HTMLDivElement;
        this.messageInput = document.getElementById('message') as HTMLInputElement;
        this.sendButton = document.getElementById('sendButton') as HTMLButtonElement;
        this.logButton = document.getElementById('logButton') as HTMLButtonElement;

        this.initialiseWebsocket();
        this.initialiseEventListeners();
    }

    private initialiseWebsocket(): void {
        this.ws.onopen = () => {
            console.log('Connected to server');
            this.displayMessage({
                text: 'Connected to server',
                timestamp: Date.now()
            });
        }

        this.ws.onmessage = (event: MessageEvent) => {
            const message: ChatMessage = {
                text: event.data as string,
                timestamp: Date.now()
            }
            this.displayMessage(message);
        }

        this.ws.onclose = () => {
            console.log('Disconnected from the Websocket server')
            this.displayMessage({ text: "Disconnected from the server", timestamp: Date.now()})
        }

        this.ws.onerror = (error: Event) => {
            console.error("Websocket error: ", error)
            this.displayMessage({ text: 'Error occurred', timestamp: Date.now() });

        }
    }

    private initialiseEventListeners(): void {
        this.sendButton.addEventListener('click', () => this.sendMessage())
        this.messageInput.addEventListener('keypress', (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        })
        this.logButton.addEventListener('click', () => this.logChatContents())
    }

    private sendMessage(): void {
        const message = this.messageInput.value.trim();
        if (message && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(message);
            this.messageInput.value = '';
        }
    }

    private displayMessage(message: ChatMessage): void {
        const msgDiv = document.createElement('div');
        msgDiv.textContent = `[${message.timestamp}] ${message.text}`;
        this.chatDiv.appendChild(msgDiv)
        this.chatDiv.scrollTop = this.chatDiv.scrollHeight;
    }

    private logChatContents(): void {
        const messages = Array.from(this.chatDiv.children).map(div => div.textContent);
        console.log('Current chat contents:', messages);
    }
}

window.onload = () => {
    new ChatApp();
}