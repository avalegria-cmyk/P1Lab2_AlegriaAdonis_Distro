const http = require("http");
const fs = require("fs");
const path = require("path");
const { WebSocketServer } = require("ws");

const reto1 = require("../../retos/reto1/server");
const reto2 = require("../../retos/reto2/server");
const reto3 = require("../../retos/reto3/server");
const reto4 = require("../../retos/reto4/server");
const reto5 = require("../../retos/reto5/server");
const reto6 = require("../../retos/reto6/server");
const reto7 = require("../../retos/reto7/server");
const reto8 = require("../../retos/reto8/server");
const reto9 = require("../../retos/reto9/server");

const HOST = "0.0.0.0";
const PORT = process.env.PORT || 8080;
const ROOT_DIR = path.resolve(__dirname, "..", "..");
const INTERFAZ_DIR = path.join(ROOT_DIR, "interfaz");

let nextClientId = 1;
const clients = new Map();

function parseJSON(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function send(ws, payload) {
  if (ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify(payload));
  }
}

function broadcastToRoom(room, payload, excludeWs = null) {
  for (const [clientWs, info] of clients.entries()) {
    if (info.room === room && clientWs !== excludeWs) {
      send(clientWs, payload);
    }
  }
}

function getRoomUsers(room) {
  const users = [];
  for (const info of clients.values()) {
    if (info.room === room) {
      users.push({ id: info.id, username: info.username });
    }
  }
  return users;
}

function staticFile(req, res) {
  const urlPath = req.url === "/" ? "/interfaz/index.html" : req.url;
  const safePath = path.normalize(urlPath).replace(/^\.\.(\\|\/)+/, "");
  const filePath = path.join(ROOT_DIR, safePath);

  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403);
    res.end("Acceso denegado");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404);
      res.end("No encontrado");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = {
      ".html": "text/html; charset=utf-8",
      ".css": "text/css; charset=utf-8",
      ".js": "application/javascript; charset=utf-8",
      ".json": "application/json; charset=utf-8",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".gif": "image/gif",
      ".svg": "image/svg+xml",
    }[ext] || "application/octet-stream";

    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  });
}

const server = http.createServer(staticFile);
const wss = new WebSocketServer({ server });

const historyManager = reto5.createHistoryManager(30);
const boardManager = reto9.createBoardManager(600);

const common = {
  clients,
  send,
  broadcastToRoom,
  getRoomUsers,
  historyManager,
  boardManager,
  systemMessage(room, text) {
    broadcastToRoom(room, {
      type: "system",
      room,
      text,
      at: new Date().toISOString(),
    });
  },
};

wss.on("connection", (ws) => {
  const client = {
    id: nextClientId++,
    username: "Invitado",
    room: "general",
  };

  clients.set(ws, client);

  send(ws, {
    type: "welcome",
    id: client.id,
    username: client.username,
    room: client.room,
    at: new Date().toISOString(),
  });

  reto3.notifyUsers(common, client.room);
  reto5.sendHistory(common, ws, client.room);
  reto9.sendBoardSnapshot(common, ws, client.room);

  ws.on("message", (raw) => {
    const payload = parseJSON(raw.toString());
    if (!payload || typeof payload.type !== "string") {
      send(ws, { type: "error", message: "Mensaje JSON invalido" });
      return;
    }

    const current = clients.get(ws);
    if (!current) {
      return;
    }

    if (payload.type === "join") {
      const oldRoom = current.room;
      const joinData = reto6.parseJoinPayload(payload);

      current.username = joinData.username;
      current.room = joinData.room;
      clients.set(ws, current);

      send(ws, {
        type: "joined",
        username: joinData.username,
        room: joinData.room,
        at: new Date().toISOString(),
      });

      reto4.onJoin(common, joinData.username, oldRoom, joinData.room);
      reto3.notifyUsers(common, oldRoom);
      reto3.notifyUsers(common, joinData.room);
      reto5.sendHistory(common, ws, joinData.room);
      reto9.sendBoardSnapshot(common, ws, joinData.room);
      return;
    }

    if (payload.type === "chat") {
      const text = String(payload.text || "").trim();
      if (!text) {
        return;
      }

      const chatMessage = {
        type: "chat",
        id: current.id,
        username: current.username,
        room: current.room,
        text: text.slice(0, 1000),
        at: new Date().toISOString(),
      };

      historyManager.push(current.room, chatMessage);
      broadcastToRoom(current.room, chatMessage);
      return;
    }

    if (payload.type === "image") {
      const result = reto1.buildImageMessage(current, payload);
      if (!result.ok) {
        send(ws, { type: "error", message: result.error });
        return;
      }

      historyManager.push(current.room, result.message);
      broadcastToRoom(current.room, result.message);
      return;
    }

    if (payload.type === "typing") {
      reto7.handleTyping(common, ws, current, payload);
      return;
    }

    if (payload.type === "file") {
      const result = reto2.buildFileMessage(current, payload);
      if (!result.ok) {
        send(ws, { type: "error", message: result.error });
        return;
      }

      historyManager.push(current.room, result.message);
      broadcastToRoom(current.room, result.message);
      return;
    }

    if (payload.type === "board-draw" || payload.type === "board-clear") {
      const result = reto9.handleBoardEvent(common, current, payload);
      if (!result.ok) {
        send(ws, { type: "error", message: result.error });
      }
      return;
    }

    if (payload.type === "ping") {
      reto8.handlePing(common, ws);
      return;
    }

    send(ws, { type: "error", message: "Tipo de evento no soportado" });
  });

  ws.on("close", () => {
    const existing = clients.get(ws);
    clients.delete(ws);
    if (!existing) {
      return;
    }
    reto4.onDisconnect(common, existing);
    reto3.notifyUsers(common, existing.room);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Servidor WebSocket activo en http://localhost:${PORT}`);
  console.log("Interfaz principal:", path.join(INTERFAZ_DIR, "index.html"));
});
