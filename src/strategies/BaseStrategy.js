import utils from '../utils';

class BaseStrategy {
  constructor(scanner) {
    this.scanner = scanner;
    this.config = scanner.config;
  }

  activate() {
    console.log('Scanner should be activated');
  }

  deactivate() {
    console.log('Scanner should be deactivated');
  }

  checkAutoDeactivation(event) {
    console.log('Strategy should provide a checkAutoDeactivation function');
  }

  getNextScannableId(focusedId = this.scanner.state.focusedId) {
    const { keysToIterate } = this.scanner.state;
    const nextFocusedIndex = keysToIterate.indexOf(focusedId) + 1;

    return nextFocusedIndex < keysToIterate.length
      ? keysToIterate[nextFocusedIndex]
      : keysToIterate[0];
  }

  dispatchEvent(scannable, event) {
    this.scanner.setSelectedElement(scannable, event);
    utils.dispatchEvent(scannable, event);
    scannable.element.onSelect(event);
  }

  selectElement(scannable, event) {
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

export default BaseStrategy;
