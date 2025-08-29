type SearchEvents = {
  'search:query': string;   // user typed a search query
  'search:clear': void;     // clear search input
  'search:focus': void;     // search bar focused
  'search:blur': void;      // search bar unfocused
};

const searchPostEvent = {
  listeners: new Map<keyof SearchEvents, Set<Function>>(),

  emit<T extends keyof SearchEvents>(event: T, payload?: SearchEvents[T]) {
    this.listeners.get(event)?.forEach(callback => callback(payload));
    console.log(`Search event emitted: ${event}`, payload);
  },

  on<T extends keyof SearchEvents>(event: T, callback: (payload: SearchEvents[T]) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
  },

  off<T extends keyof SearchEvents>(event: T, callback: (payload: SearchEvents[T]) => void) {
    this.listeners.get(event)?.delete(callback);
  },

  clear() {
    this.listeners.clear();
  }
};

export default searchPostEvent;
