const dispatchEvent = (element, event) => {
  const { node } = element;
  var eventToDispatch = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: false
  });

  node.dispatchEvent(eventToDispatch);
};

export default dispatchEvent;
