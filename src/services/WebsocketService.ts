// src/services/WebSocketService.ts
class WebSocketService {
    url: string;
    jwtToken: string;
    socket: WebSocket | null;
    listeners: Function[];

    constructor(url: string, jwtToken: string) {
      this.url = url;
      this.jwtToken = jwtToken;
      this.socket = null;
      this.listeners = [];
    }
  
    connect() {
      this.socket = new WebSocket(this.url, this.jwtToken);
  
      this.socket.onopen = () => {
        console.log('WebSocket connection established');
      };
  
      this.socket.onmessage = (event) => {
        this.listeners.forEach((listener) => listener(event.data));
      };
  
      this.socket.onclose = () => {
        console.log('WebSocket connection closed');
      };
  
      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    }
  
    sendMessage(message: string) {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        // send message with type and data
        this.socket.send(message);
      } else {
        console.error('WebSocket is not open');
      }
    }
  
    addListener(listener: Function) {
      this.listeners.push(listener);
    }
  
    removeListener(listener: Function) {
      this.listeners = this.listeners.filter((l) => l !== listener);
    }
  }
  
  export default WebSocketService;
  