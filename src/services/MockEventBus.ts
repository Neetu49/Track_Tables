export interface BusEvent {
  type: string;
  payload: any;
  timestamp: number;
}

type EventCallback = (data: any) => void;

class EventBus {
  private listeners: Record<string, EventCallback[]> = {};
  private globalListeners: EventCallback[] = [];
  private history: BusEvent[] = [];

  subscribe(event: string, callback: EventCallback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    return () => this.unsubscribe(event, callback);
  }

  subscribeAll(callback: EventCallback) {
    this.globalListeners.push(callback);
    return () => {
      this.globalListeners = this.globalListeners.filter(cb => cb !== callback);
    };
  }

  unsubscribe(event: string, callback: EventCallback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }

  emit(event: string, data: any) {
    const busEvent = { type: event, payload: data, timestamp: Date.now() };
    this.history = [busEvent, ...this.history].slice(0, 50); // Keep last 50 events

    // Simulate network delay for real-time feel
    setTimeout(() => {
      if (this.listeners[event]) {
        this.listeners[event].forEach(cb => cb(data));
      }
      this.globalListeners.forEach(cb => cb(busEvent));
    }, 100);
  }

  // Used only for receiving external syncs without re-broadcasting
  emitLocal(event: string, data: any) {
    const busEvent = { type: event, payload: data, timestamp: Date.now() };
    this.history = [busEvent, ...this.history].slice(0, 50);

    setTimeout(() => {
      if (this.listeners[event]) {
        this.listeners[event].forEach(cb => cb(data));
      }
      this.globalListeners.forEach(cb => cb(busEvent));
    }, 100);
  }

  getHistory() {
    return this.history;
  }
}

export const MockEventBus = new EventBus();

// Cross-tab synchronization for EventBus
const eventChannel = new BroadcastChannel('mock-event-bus-sync');
eventChannel.onmessage = (e) => {
  if (e.data.type === 'EMIT') {
    MockEventBus.emitLocal(e.data.event, e.data.payload);
  }
};

// Override emit to also broadcast
const originalEmit = MockEventBus.emit.bind(MockEventBus);
MockEventBus.emit = (event: string, data: any) => {
  originalEmit(event, data);
  eventChannel.postMessage({ type: 'EMIT', event, payload: data });
};
