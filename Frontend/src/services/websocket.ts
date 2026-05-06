/**
 * @file src/services/websocket.ts
 * @description WebSocket service for real-time order updates.
 */

class WebSocketService {
  private socket: WebSocket | null = null;

  connect(vendorId: string) {
    this.socket = new WebSocket(`wss://api.fooddesk.com/ws/${vendorId}`);

    this.socket.onopen = () => {
      console.log('Connected to Kitchen WebSocket');
    };

    this.socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log('WS Message:', data);
      // Handle real-time updates here
    };

    this.socket.onerror = (e) => {
      console.error('WS Error:', e);
    };

    this.socket.onclose = () => {
      console.log('WS Closed. Retrying...');
      setTimeout(() => this.connect(vendorId), 5000);
    };
  }

  disconnect() {
    this.socket?.close();
  }
}

export const wsService = new WebSocketService();
