type stackEventTypes = "post:created" | "post:deleted" | "post:commented" | "post:liked" | "post:unliked" | "post:share";
type Handler = (...args: any[]) => void;

const listeners: { [K in stackEventTypes]?: Handler[] } = {};

export const detailStackEvent = {
  on(event: stackEventTypes, handler: Handler) {
    listeners[event] = listeners[event] || [];
    listeners[event]!.push(handler);
  },
  off(event: stackEventTypes, handler: Handler) {
    listeners[event] = (listeners[event] || []).filter(h => h !== handler);
  },
  emit(event: stackEventTypes, ...args: any[]) {
    (listeners[event] || []).forEach(h => h(...args));
  }
};