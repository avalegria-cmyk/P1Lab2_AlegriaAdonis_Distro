const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;
function buildImageMessage(currentClient, payload) {
  if (
    typeof payload.name !== "string" ||
    typeof payload.mime !== "string" ||
    typeof payload.data !== "string"
  ) {
    return { ok: false, error: "Imagen no válida" };
  }

  if (!payload.mime.startsWith("image/")) {
    return { ok: false, error: "El archivo enviado no es una imagen" };
  }

  if (payload.data.length > MAX_FILE_SIZE_BYTES * 1.4) {
    return { ok: false, error: "Imagen demasiado grande (max 2MB)" };
  }

  return {
    ok: true,
    message: {
      type: "image",
      room: currentClient.room,
      id: currentClient.id,
      username: currentClient.username,
      name: payload.name.slice(0, 120),
      mime: payload.mime,
      data: payload.data,
      at: new Date().toISOString(),
    },
  };
}

module.exports = {
  buildImageMessage,
};
