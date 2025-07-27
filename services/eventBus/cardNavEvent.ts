type CardNavEvents = {
  'card:open': string; // card ID
  'card:close': void;
  'card:next': void;
  'card:prev': void;
};

const cardNavEvent = {
  listeners: new Map<keyof CardNavEvents, Set<Function>>(),

  emit<T extends keyof CardNavEvents>(event: T, payload?: CardNavEvents[T]) {
    this.listeners.get(event)?.forEach(callback => callback(payload));
    console.log(`Event emitted: ${event}`, payload);
  },

  on<T extends keyof CardNavEvents>(event: T, callback: (payload: CardNavEvents[T]) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
  },

  off<T extends keyof CardNavEvents>(event: T, callback: (payload: CardNavEvents[T]) => void) {
    this.listeners.get(event)?.delete(callback);
  },

  clear() {
    this.listeners.clear();
  }
};

export default cardNavEvent;