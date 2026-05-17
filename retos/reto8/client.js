export function createReconnectController(connectFn) {
  let attempts = 0;
  let timer = null;
  return {
    reset() {
      attempts = 0;
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    },schedule() {
      if (timer) {
        return;
      }const delay = Math.min(10000, 1000 * 2 ** attempts);
      attempts += 1;
      timer = setTimeout(() => {
        timer = null;
        connectFn();
      }, delay);
    },
  };
}

export function startHeartbeat(sendFn) {
  return setInterval(() => {
    sendFn({ type: "ping" });
  }, 20000);
}
