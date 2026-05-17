function onJoin(common, username, oldRoom, newRoom) {
  if (oldRoom && oldRoom !== newRoom) {
    common.systemMessage(oldRoom, `${username} salió de la sala`);
  }

  common.systemMessage(newRoom, `${username} se unió a la sala`);
}

function onDisconnect(common, client) {
  common.systemMessage(client.room, `${client.username} se desconectó`);
}

module.exports = {
  onJoin,
  onDisconnect,
};
