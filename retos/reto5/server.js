function createHistoryManager(limit) {
    const historyByRoom = new Map();
    function get(room) {return historyByRoom.get(room) || [];
    }function push(room, item) {
        const history = get(room).slice();
        history.push(item);
        if (history.length > limit) {
            history.shift();
        }historyByRoom.set(room, history);
    }return {
        get,
        push,
    };
}
function sendHistory(common, ws, room) {
    common.send(ws, {
        type: "history",
        room,
        history: common.historyManager.get(room),
    });
}
module.exports = {
    createHistoryManager,
    sendHistory,
};
