import BaseStrategy from './BaseStrategy';

const KEY_CODE_MAP = {
  enter: 13,
  backspace: 8,
  spacebar: 32,
  tab: 9
};

class ManualStrategy extends BaseStrategy {
  constructor(scanner) {
    super(scanner);

    const { selectClickEvent, advanceClickEvent, selectKeyCodes, advanceKeyCodes } = scanner.config;
    this.selectClickEvent = selectClickEvent;
    this.advanceClickEvent = advanceClickEvent;
    this.selectKeyCodes = new Set(selectKeyCodes.map(kc => KEY_CODE_MAP[kc] || kc));
    this.advanceKeyCodes = new Set(advanceKeyCodes.map(kc => KEY_CODE_MAP[kc] || kc));

    this.isActive = false;
  }

  activate() {
    this.isActive = true;
  }

  deactivate() {
    this.isActive = false;
  }

  selectElement(scannable, event) {
    const { type: eventType, keyCode } = event;

    switch (eventType) {
      case 'keydown':
        if (this.selectKeyCodes.has(keyCode)) {
          this.select(scannable, event);
        } else if (this.advanceKeyCodes.has(keyCode) || this.advanceKeyCodes.has('*')) {
          this.advance(scannable, event);
        }
        break;

      case this.selectClickEvent:
        this.select(scannable, event);
        break;

      case this.advanceClickEvent:
        this.advance(scannable, event);
        break;

      default:
        break;
    }
  }

  advance(scannable, event) {
    const newFocusedId = this.getNextScannableId();
    this.scanner.focusScannable(newFocusedId);
  }

  select(scannable, event) {
    let selectedPath = [];
    if (scannable && scannable.treeId) {
      if (scannable.children) {
        selectedPath = this.scanner.state.selectedPath.concat(scannable.treeId);
      } else {
        this.dispatchEvent(scannable, event);
      }
    }

    this.scanner.setSelectedPath(selectedPath);
  }
}

export default ManualStrategy;
