// Session 9 - throttle utility
export const throttle = (fn, limit = 200) => {
  let inThrottle = false;
  let lastArgs = null;
  return function throttled(...args) {
    if (inThrottle) { lastArgs = args; return; }
    fn.apply(this, args);
    inThrottle = true;
    setTimeout(() => {
      inThrottle = false;
      if (lastArgs) { fn.apply(this, lastArgs); lastArgs = null; }
    }, limit);
  };
};
