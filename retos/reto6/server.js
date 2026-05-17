function parseJoinPayload(payload) {
  const username = String(payload.username || "Invitado").trim().slice(0, 24) || "Invitado";
  const room = String(payload.room || "general").trim().slice(0, 24) || "general";
  return { username, room };
}

module.exports = {
  parseJoinPayload,
};
