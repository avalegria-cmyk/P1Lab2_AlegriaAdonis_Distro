function createBoardManager(limit) {
  const boardByRoom = new Map();

  function get(room) {
    return boardByRoom.get(room) || [];
  }

  function push(room, drawEvent) {
    const events = get(room).slice();
    events.push(drawEvent);
    if (events.length > limit) {
      events.shift();
    }
    boardByRoom.set(room, events);
  }

  function clear(room) {
    boardByRoom.set(room, []);
  }

  return {
    get,
    push,
    clear,
  };
}

function sendBoardSnapshot(common, ws, room) {
  common.send(ws, {
    type: "board-snapshot",
    room,
    events: common.boardManager.get(room),
  });
}

function isValidPoint(value) {
  return Number.isFinite(value) && value >= 0 && value <= 1;
}

function handleBoardEvent(common, currentClient, payload) {
  if (payload.type === "board-draw") {
    const d = payload.draw || {};
    if (
      !isValidPoint(d.x0) ||
      !isValidPoint(d.y0) ||
      !isValidPoint(d.x1) ||
      !isValidPoint(d.y1)
    ) {
      return { ok: false, error: "Trazo invalido" };
    }const event = {
      type: "board-draw",
      room: currentClient.room,
      draw: {
        x0: d.x0,
        y0: d.y0,
        x1: d.x1,
        y1: d.y1,
        color: typeof d.color === "string" ? d.color.slice(0, 20) : "#1f2a36",
        size: Number.isFinite(d.size) ? Math.max(1, Math.min(20, d.size)) : 2,
      },
      by: currentClient.username,
      at: new Date().toISOString(),
    };
    common.boardManager.push(currentClient.room, event.draw);
    common.broadcastToRoom(currentClient.room, event);
    return { ok: true };
  }if (payload.type === "board-clear") {
    common.boardManager.clear(currentClient.room);
    common.broadcastToRoom(currentClient.room, {
      type: "board-clear",
      room: currentClient.room,
      by: currentClient.username,
      at: new Date().toISOString(),
    });
    return { ok: true };
  }return { ok: false, error: "Evento de pizarra no soportado" };
}

module.exports = {
  createBoardManager,
  sendBoardSnapshot,
  handleBoardEvent,
};
