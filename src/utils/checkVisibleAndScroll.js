import checkVisible from './checkVisible';

const checkVisibleAndScroll = (element, threshold = 0, mode = 'visible') => {
  const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
  const fixedThreshold = (viewHeight * threshold) / 100;
  const { isVisible, rect } = checkVisible(element, fixedThreshold, mode);
  const { scrollX, scrollY } = window;

  if (!isVisible) {
    const elementPosY = scrollY + rect.top - fixedThreshold;
    window.scrollTo(scrollX, elementPosY);
    element.scrollIntoView();
  }
};

export default checkVisibleAndScroll;
