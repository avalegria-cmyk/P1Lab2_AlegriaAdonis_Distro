function handleTyping(common, ws, currentClient, payload) {
  common.broadcastToRoom(
    currentClient.room,
    {type: "typing",
      room: currentClient.room,
      username: currentClient.username,
      isTyping: Boolean(payload.isTyping),
    },ws
  );
}

module.exports = {
  handleTyping,
};
