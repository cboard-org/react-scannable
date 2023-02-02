const checkVisible = (element, threshold = 0, mode = 'visible') => {
  const rect = element.getBoundingClientRect();
  const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
  const above = rect.bottom - threshold < 0;
  const below = rect.top - viewHeight + threshold >= 0;

  let isVisible = !above && !below;
  if (mode === 'above') {
    isVisible = above;
  }

  if (mode === 'below') {
    isVisible = below;
  }

  return {
    isVisible,
    above,
    below,
    rect,
    viewHeight,
  };
};

export default checkVisible;
