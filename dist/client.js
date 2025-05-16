"use strict";
class ChatApp {
    constructor() {
        this.ws = new WebSocket("ws://localhost:8080");
        this.chatDiv = document.getElementById('chat');
        this.messageInput = document.getElementById('message');
        this.sendButton = document.getElementById('sendButton');
        this.initialiseWebsocket();
    }
    initialiseWebsocket() {
        this.ws.onopen = () => {
            console.log('Connected to server');
            this.displayMessage({
                text: 'Connected to server',
                timestamp: Date.now()
            });
        };
        this.ws.onmessage = (event) => {
            const message = {
                text: event.data,
                timestamp: Date.now()
            };
            this.displayMessage(message);
        };
        this.ws.onclose = () => {
            console.log('Disconnected from the Websocket server');
            this.displayMessage({ text: "Disconnected from the server", timestamp: Date.now() });
        };
        this.ws.onerror = (error) => {
            console.error("Websocket error: ", error);
            this.displayMessage({ text: 'Error occurred', timestamp: Date.now() });
        };
    }
    initialiseEventListeners() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
    }
    sendMessage() {
        const message = this.messageInput.value.trim();
        if (message && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(message);
            this.messageInput.value = '';
        }
    }
    displayMessage(message) {
        const msgDiv = document.createElement('div');
        msgDiv.textContent = `[${message.timestamp}] ${message.text}`;
        this.chatDiv.appendChild(msgDiv);
        this.chatDiv.scrollTop = this.chatDiv.scrollHeight;
    }
}
window.onload = () => {
    new ChatApp();
};
