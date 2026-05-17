function onJoin(common, username, oldRoom, newRoom) {
  if (oldRoom && oldRoom !== newRoom) {
    common.systemMessage(oldRoom, `${username} salio de la sala`);
  }  common.systemMessage(newRoom, `${username} se unio a la sala`);
}function onDisconnect(common, client) {
  common.systemMessage(client.room, `${client.username} se desconecto`);
}

module.exports = {
  onJoin,
  onDisconnect,
};
