export function renderFileMessage(messageContainer, payload) {
  const article = document.createElement("article");
  article.className = "message";
  const meta = document.createElement("div");
  meta.className = "meta";
  meta.textContent = `${payload.username} · ${new Date(payload.at).toLocaleTimeString()}`;
  article.appendChild(meta);
  const label = document.createElement("div");
  label.textContent = `Archivo: ${payload.name}`;
  article.appendChild(label);
  const link = document.createElement("a");
  link.href = payload.data;
  link.download = payload.name;
  link.textContent = "Descargar";
  article.appendChild(link);
  messageContainer.appendChild(article);
  messageContainer.scrollTop = messageContainer.scrollHeight;
}

export function sendSelectedFile(fileInput, sendFn, onError) {
  const file = fileInput.files[0];
  if (!file) {
    return;
  }if (file.size > 2 * 1024 * 1024) {
    onError("El archivo supera 2MB");
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    sendFn({
      type: file.type.startsWith("image/") ? "image" : "file",
      name: file.name,
      mime: file.type || "application/octet-stream",
      data: reader.result,
    });
    fileInput.value = "";
  };
  reader.readAsDataURL(file);
}
