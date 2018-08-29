import BaseStrategy from './BaseStrategy';

class AutomaticStrategy extends BaseStrategy {
  activate() {
    this.clearIterateInterval();

    if (this.scanner.state.keysToIterate.length) {
      this.iterateIntervalFn = setInterval(() => {
        const newFocusedId = this.getNextScannableId();
        this.scanner.focusScannable(newFocusedId);
      }, this.config.iterationInterval);
    }
  }

  deactivate() {
    this.clearIterateInterval();
  }

  clearIterateInterval() {
    if (this.iterateIntervalFn) {
      clearInterval(this.iterateIntervalFn);
    }
  }
}

export default AutomaticStrategy;
