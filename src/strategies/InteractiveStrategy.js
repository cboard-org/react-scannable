import ManualStrategy from './ManualStrategy';
import { KEY_CODE_MAP } from '../constants';
import NavigationElement from '../utils/models/NavigationElement';

class InteractiveStrategy extends ManualStrategy {
  constructor(scanner) {
    super(scanner);

    const { moveUpKeyCodes, moveDownKeyCodes } = scanner.config;

    this.moveUpKeyCodes = new Set(moveUpKeyCodes.map((kc) => KEY_CODE_MAP[kc] || kc));
    this.moveDownKeyCodes = new Set(moveDownKeyCodes.map((kc) => KEY_CODE_MAP[kc] || kc));
  }

  findScannableInDirection(direction) {
    const { keysToIterate, elementsToIterate, focusedId } = this.scanner.state;
    if (keysToIterate.length === 0) return null;
    if (!focusedId || focusedId === 'not-valid-id' || !elementsToIterate[focusedId]) {
      // if no current element, return the first available
      return keysToIterate[0];
    }

    const currentElement = new NavigationElement(focusedId, elementsToIterate[focusedId]);
    const currentRect = currentElement.rect;
    if (!currentRect) {
      // If current element has no position, move to first element
      return keysToIterate[0];
    }

    // Track best candidates for direct navigation
    let bestUp = null;
    let bestDown = null;

    // Track wrap candidates (elements at opposite end for wrapping)
    let bestUpWrap = {
      element: currentElement,
      score: -1,
    };
    let bestDownWrap = {
      element: currentElement,
      score: -1,
    };

    keysToIterate.forEach((key) => {
      if (key === focusedId) return;

      const element = new NavigationElement(key, elementsToIterate[key]);
      if (!element || !element.center) return;

      // Only consider elements with horizontal overlap
      if (!element.hasHorizontalOverlap(currentElement)) return;

      const verticalDistance = element.verticalDistance(currentElement);

      if (element.isAbove(currentElement)) {
        // Update best upward candidate
        if (element.isBetterThan(bestUp, verticalDistance)) {
          bestUp = { element, score: verticalDistance };
        }
        // Update downward wrap candidate (topmost element for wrapping down)
        if (element.isBetterWrapThan(bestDownWrap, verticalDistance, true)) {
          bestDownWrap = { element, score: verticalDistance };
        }
      } else if (element.isBelow(currentElement)) {
        // Update best downward candidate
        if (element.isBetterThan(bestDown, verticalDistance)) {
          bestDown = { element, score: verticalDistance };
        }

        // Update upward wrap candidate (bottommost element for wrapping up)
        if (element.isBetterWrapThan(bestUpWrap, verticalDistance)) {
          bestUpWrap = { element, score: verticalDistance };
        }
      }
    });
    // Return appropriate candidate based on direction
    if (direction === 'up') {
      return bestUp ? bestUp.element.id : bestUpWrap.element.id;
    }

    if (direction === 'down') {
      return bestDown ? bestDown.element.id : bestDownWrap.element.id;
    }

    return keysToIterate[0];
  }

  /**
   * Navigate in the specified vertical direction
   * @param {string} direction - Direction to navigate ('up' or 'down')
   * @param {Event} event - The keyboard event
   */
  navigateInDirection(direction, event) {
    const newFocusedId = this.findScannableInDirection(direction);
    if (newFocusedId) {
      this.scanner.focusScannable(newFocusedId);
    }
  }

  /**
   * Handle element selection based on event type
   * @param {Object} scannable - The scannable element
   * @param {Event} event - The triggering event
   * @override
   */
  selectElement(scannable, event) {
    const { type: eventType, keyCode } = event;

    // Handle arrow keys first
    if (eventType === 'keydown') {
      if (this.moveUpKeyCodes.has(keyCode)) {
        this.navigateInDirection('up', event);
        return;
      }
      if (this.moveDownKeyCodes.has(keyCode)) {
        this.navigateInDirection('down', event);
        return;
      }
    }

    // Delegate all other cases to parent class
    super.selectElement(scannable, event);
  }
}

export default InteractiveStrategy;
