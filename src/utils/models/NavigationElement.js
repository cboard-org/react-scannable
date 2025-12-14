import { getElementCenter, getElementRect } from '../elementGeometry';

/**
 * Candidate wrapper class for navigation
 * Encapsulates scannable geometry data for spatial navigation algorithms
 */
class NavigationElement {
  /**
   * Create a navigation candidate
   * @param {string} id - Unique identifier for the scannable element
   * @param {Object} scannable - Scannable element object
   */
  constructor(id, scannable) {
    this.id = id;
    this.scannable = scannable;
    this.rect = scannable ? getElementRect(scannable) : null;
    this.center = this.rect ? getElementCenter(this.rect) : null;
  }

  /**
   * Check if this candidate has horizontal overlap with another
   * @param {NavigationElement} other - First rectangle
   * @returns {boolean} True if candidates overlap horizontally
   */
  hasHorizontalOverlap(other) {
    if (!this.rect || !other.rect) return false;
    return this.rect.left < other.rect.right && this.rect.right > other.rect.left;
  }

  /**
   * Calculate vertical distance to another candiate
   * @param {NavigationElement} other - Another navigation element
   * @returns {number} Vertical distance in pixels
   */
  verticalDistance(other) {
    if (!this.rect || !other.rect) return Infinity;
    return Math.abs(this.rect.top - other.rect.top);
  }

  /**
   * Check if this element is above another
   * @param {NavigationElement} other - Another navigation element
   * @returns {boolean} True if this element is above the other
   */
  isAbove(other) {
    if (!this.center || !other.rect) return false;
    return this.center.y < other.rect.top;
  }

  /**
   * Check if this element is below another
   * @param {NavigationElement} other - Another navigation element
   * @returns {boolean} True if this element is below the other
   */
  isBelow(other) {
    if (!this.center || !other.rect) return false;
    return this.center.y > other.rect.top;
  }

  /**
   * Check if this element is left of another
   * @param {NavigationElement} other - Another navigation element
   * @returns {boolean} True if this element is to the left
   */
  isLeftOf(other) {
    if (!this.rect || !other.rect) return false;
    return this.rect.left < other.rect.left;
  }

  /**
   * Check if this element is better than another based on distance and position
   * @param {Object} currentBest - Current best candidate object with {element, score}
   * @param {number} distance - Distance to compare
   * @returns {boolean} True if this element is better
   */
  isBetterThan(currentBest, distance) {
    if (!currentBest) return true;
    if (distance < currentBest.score) return true;
    if (distance === currentBest.score && this.isLeftOf(currentBest.element)) return true;
    return false;
  }

  /**
   * Check if this element is better for wrapping
   * @param {Object} currentWrap - Current wrap candidate object with {element, score}
   * @param {number} distance - Distance to compare
   * @param {boolean} preferLeft - Whether to prefer left position on tie
   * @returns {boolean} True if this element is better for wrapping
   */
  isBetterWrapThan(currentWrap, distance, preferLeft = false) {
    if (distance < currentWrap.score) return false;
    if (distance > currentWrap.score) return true;
    return preferLeft ? this.isLeftOf(currentWrap.element) : currentWrap.element.isLeftOf(this);
  }
}
export default NavigationElement;
