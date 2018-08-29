// https://gist.github.com/nmsdvid/8807205#gistcomment-2595895
// const debounce = (callback, time = 250, debounceInterval) => (...args) =>
//   clearTimeout(debounceInterval, (debounceInterval = setTimeout(() => callback(...args), time)));

const debounce = (callback, time = 250, immediate = true) => {
  let timeout;
  return (...args) => {
    if (immediate && !timeout) {
      callback(...args);
    }

    clearTimeout(timeout);
    timeout = setTimeout(function() {
      timeout = null;
      if (!immediate) {
        callback(...args);
      }
    }, time);
  };
};

export default debounce;
