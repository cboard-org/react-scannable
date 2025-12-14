/**
 * Utility functions for scannable geometry calculations
 * Used for spatial navigation in scanning strategies
 */

/**
 * Get the position and dimensions of and element
 * @param {Object} scannable - Scannable element
 * @returns {DOMRect | null} Element bounding rectangle or null
 */
export function getElementRect(scannable) {
  if (!scannable || !scannable.node) {
    return null;
  }
  return scannable.node.getBoundingClientRect();
}

/**
 * Get the center point of an element
 * @param {DOMRect} rect - Element bounding rectangle
 * @returns {Object} Center point with x and y coordinates
 */
export function getElementCenter(rect) {
  if (!rect) {
    return null;
  }
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}
