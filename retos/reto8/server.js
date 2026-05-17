function handlePing(common, ws) {
  common.send(ws, {
    type: "pong",
    at: new Date().toISOString(),
  });
}

module.exports = {
  handlePing,
};
