type Listener = (showSecondSide: boolean) => void;

class DualCardSideService {
  private showSecondSide = false;
  private listeners: Listener[] = [];

  getState() {
    return this.showSecondSide;
  }

  setState(value: boolean) {
    this.showSecondSide = value;
    this.emit();
  }

  toggleState() {
    this.showSecondSide = !this.showSecondSide;
    this.emit();
  }

  subscribe(listener: Listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private emit() {
    this.listeners.forEach((l) => l(this.showSecondSide));
  }
}

export const dualCardSideService = new DualCardSideService();
