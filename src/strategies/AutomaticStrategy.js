import BaseStrategy from './BaseStrategy';
import { KEY_CODE_MAP } from '../constants';

class AutomaticStrategy extends BaseStrategy {
  constructor(scanner) {
    super(scanner);

    this.autoDeactivationCounter = 0;
    this.autoDeactivationToutFn = null;
    this.autoDeactivationKeyCodes = new Set(
      scanner.config.autoDeactivateKeyCodes.map(kc => KEY_CODE_MAP[kc] || kc)
    );
  }

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

  checkAutoDeactivation(event) {
    const { type: eventType, keyCode } = event;
    if (eventType === 'keydown') {
      if (this.autoDeactivationKeyCodes.has(keyCode)) {
        if (this.autoDeactivationToutFn) {
          clearTimeout(this.autoDeactivationToutFn);
        }

        this.autoDeactivationCounter = this.autoDeactivationCounter + 1;
        if (this.autoDeactivationCounter >= this.scanner.config.autoDeactivateCount) {
          this.deactivate();
          this.scanner.triggerDeactivation();
          this.autoDeactivationCounter = 0;
        } else {
          this.autoDeactivationToutFn = setTimeout(() => {
            this.autoDeactivationCounter = 0;
          }, 600);
        }

        return false;
      }
    }

    return true;
  }

  clearIterateInterval() {
    if (this.iterateIntervalFn) {
      clearInterval(this.iterateIntervalFn);
    }
  }
}

export default AutomaticStrategy;
