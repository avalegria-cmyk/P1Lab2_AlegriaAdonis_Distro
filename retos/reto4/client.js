export function renderSystem(messageContainer, text, at) {
  const article = document.createElement("article");
  article.className = "message system";
  article.innerHTML = `
    <div class="meta">Sistema · ${new Date(at).toLocaleTimeString()}</div>
    <div>${text}</div>  `;
  messageContainer.appendChild(article);
  messageContainer.scrollTop = messageContainer.scrollHeight;
}
