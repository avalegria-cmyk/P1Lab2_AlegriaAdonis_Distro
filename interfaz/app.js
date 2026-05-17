import { renderImageMessage } from "../retos/reto1/client.js";
import { renderFileMessage, sendSelectedFile } from "../retos/reto2/client.js";
import { renderUsers } from "../retos/reto3/client.js";
import { renderSystem } from "../retos/reto4/client.js";
import { clearMessages } from "../retos/reto5/client.js";
import { setActiveRoom } from "../retos/reto6/client.js";
import { createTypingController, setTypingIndicator } from "../retos/reto7/client.js";
import { createReconnectController, startHeartbeat } from "../retos/reto8/client.js";
import { setupBoard } from "../retos/reto9/client.js";

const statusEl = document.getElementById("status");
const usersCountEl = document.getElementById("usersCount");
const usersListEl = document.getElementById("usersList");
const roomLabelEl = document.getElementById("roomLabel");
const typingIndicatorEl = document.getElementById("typingIndicator");
const messagesEl = document.getElementById("messages");
const usernameEl = document.getElementById("username");
const roomEl = document.getElementById("room");
const joinBtn = document.getElementById("joinBtn");
const messageForm = document.getElementById("messageForm");
const messageInput = document.getElementById("messageInput");
const fileInput = document.getElementById("fileInput");
const sendFileBtn = document.getElementById("sendFileBtn");
const boardCanvas = document.getElementById("boardCanvas");
const clearBoardBtn = document.getElementById("clearBoardBtn");

let socket;
let heartbeatId = null;
const board = setupBoard(boardCanvas, clearBoardBtn, send);

function wsURL() {
  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  return `${protocol}://${window.location.host}`;
}

function setConnectionStatus(connected) {
  statusEl.textContent = connected ? "Conectado" : "Desconectado";
  statusEl.classList.toggle("on", connected);
  statusEl.classList.toggle("off", !connected);
}

function send(payload) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(payload));
  }
}

function renderChatMessage(payload) {
  const article = document.createElement("article");
  article.className = "message";
  article.innerHTML = `
    <div class="meta">${payload.username} · ${new Date(payload.at).toLocaleTimeString()}</div>
    <div>${payload.text}</div>
  `;
  messagesEl.appendChild(article);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function joinRoom() {
  const username = (usernameEl.value || "Invitado").trim() || "Invitado";
  const room = (roomEl.value || "general").trim() || "general";
  setActiveRoom(roomLabelEl, room);
  send({ type: "join", username, room });
}

const reconnect = createReconnectController(() => connect());
const typing = createTypingController(send);

function connect() {
  socket = new WebSocket(wsURL());
  setConnectionStatus(false);

  socket.addEventListener("open", () => {
    setConnectionStatus(true);
    reconnect.reset();
    if (heartbeatId) {
      clearInterval(heartbeatId);
    }
    heartbeatId = startHeartbeat(send);
    joinRoom();
  });

  socket.addEventListener("close", () => {
    setConnectionStatus(false);
    if (heartbeatId) {
      clearInterval(heartbeatId);
      heartbeatId = null;
    }
    reconnect.schedule();
  });

  socket.addEventListener("error", () => {
    setConnectionStatus(false);
  });

  socket.addEventListener("message", (event) => {
    const payload = JSON.parse(event.data);

    if (payload.type === "history") {
      clearMessages(messagesEl);
      for (const item of payload.history) {
        if (item.type === "chat") {
          renderChatMessage(item);
        } else if (item.type === "image") {
          renderImageMessage(messagesEl, item);
        } else if (item.type === "file") {
          renderFileMessage(messagesEl, item);
        }
      }
      return;
    }if (payload.type === "users") {
      renderUsers(usersListEl, usersCountEl, payload.users || []);
      return;
    } if (payload.type === "typing") {
      setTypingIndicator(typingIndicatorEl, payload);
      return;
    }if (payload.type === "system") {
      renderSystem(messagesEl, payload.text, payload.at);
      return;
    }if (payload.type === "chat") {
      renderChatMessage(payload);
      return;
    }if (payload.type === "image") {
      renderImageMessage(messagesEl, payload);
      return;
    }if (payload.type === "file") {
      renderFileMessage(messagesEl, payload);
      return;
    }if (payload.type === "board-draw") {
      board.drawRemote(payload.draw);
      return;
    }if (payload.type === "board-clear") {
      board.clear();
      return;
    }if (payload.type === "board-snapshot") {
      board.renderSnapshot(payload.events || []);
      return;
    }if (payload.type === "pong") {
      return;
    }if (payload.type === "error") {
      renderSystem(messagesEl, `Error: ${payload.message}`, new Date().toISOString());
    }
  });
}

joinBtn.addEventListener("click", joinRoom);

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = messageInput.value.trim();
  if (!text) {
    return;
  }
  send({ type: "chat", text });
  messageInput.value = "";
  typing.onSend();
});

messageInput.addEventListener("input", () => {
  typing.onInput();
});

sendFileBtn.addEventListener("click", () => {
  sendSelectedFile(fileInput, send, (errorText) => {
    renderSystem(messagesEl, errorText, new Date().toISOString());
  });
});

connect();
