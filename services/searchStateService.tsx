type SearchStateListener = (isOpen: boolean) => void;

class SearchContainerService {
  private isOpen = false;
  private listeners: SearchStateListener[] = [];

  getState() {
    return this.isOpen;
  }

  open() {
    if (!this.isOpen) {
      this.isOpen = true;
      this.emit();
    }
  }

  close() {
    if (this.isOpen) {
      this.isOpen = false;
      this.emit();
    }
  }

  toggle() {
    this.isOpen = !this.isOpen;
    this.emit();
  }

  subscribe(listener: SearchStateListener) {
    this.listeners.push(listener);
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private emit() {
    this.listeners.forEach((listener) => listener(this.isOpen));
  }
}

export const searchContainerService = new SearchContainerService();