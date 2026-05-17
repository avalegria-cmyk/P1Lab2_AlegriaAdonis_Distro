const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;

function buildFileMessage(currentClient, payload) {
  if (
    typeof payload.name !== "string" ||
    typeof payload.mime !== "string" ||
    typeof payload.data !== "string"
  ) {
    return { ok: false, error: "Archivo no valido" };
  }if (payload.data.length > MAX_FILE_SIZE_BYTES * 1.4) {
    return { ok: false, error: "Archivo demasiado grande (max 2MB)" };
  }

  return {
    ok: true,
    message: {
      type: "file",
      room: currentClient.room,
      id: currentClient.id,
      username: currentClient.username,
      name: payload.name.slice(0, 120),
      mime: payload.mime.slice(0, 120),
      data: payload.data,
      at: new Date().toISOString(),
    },
  };
}

module.exports = {
  buildFileMessage,
};
