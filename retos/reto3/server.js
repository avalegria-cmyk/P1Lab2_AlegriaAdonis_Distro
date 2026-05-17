function notifyUsers(common, room) {
  const users = common.getRoomUsers(room);
  common.broadcastToRoom(room, {
    type: "users",
    room,
    count: users.length,
    users,
  });
}

module.exports = {
  notifyUsers,
};
