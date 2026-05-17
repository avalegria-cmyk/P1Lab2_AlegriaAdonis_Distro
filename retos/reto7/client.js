export function createTypingController(sendFn) {
  let localTyping = false;
  let timeout = null;
  function onInput() {
    if (!localTyping) {
      sendFn({ type: "typing", isTyping: true });
      localTyping = true;
    }clearTimeout(timeout);
    timeout = setTimeout(() => {
      sendFn({ type: "typing", isTyping: false });
      localTyping = false;
    }, 900);
  }function onSend() {
    sendFn({ type: "typing", isTyping: false });
    localTyping = false;
  }return {
    onInput,
    onSend,
  };
}

export function setTypingIndicator(typingIndicatorEl, payload) {
  typingIndicatorEl.textContent = payload.isTyping ? `${payload.username} esta escribiendo...` : "";
}
