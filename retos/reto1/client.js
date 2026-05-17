export function renderImageMessage(messageContainer, payload) {
  const article = document.createElement("article");
  article.className = "message";
  article.innerHTML = `
    <div class="meta">${payload.username} · ${new Date(payload.at).toLocaleTimeString()}</div>
    <div>Imagen: ${payload.name}</div>
    <img src="${payload.data}" alt="${payload.name}" />
  `;
  messageContainer.appendChild(article);
  messageContainer.scrollTop = messageContainer.scrollHeight;
}
