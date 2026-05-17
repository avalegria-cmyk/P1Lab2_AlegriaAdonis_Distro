# Laboratorio 2 - WebSockets con Node.js
## Alegria Valle Adonis

Aplicación de chat en tiempo real desarrollada con Node.js y WebSockets. El proyecto fue construido por retos, incorporando funcionalidades progresivas de comunicación distribuida hasta llegar a un sistema con envío de archivos, salas, historial, reconexión y pizarra colaborativa.

## Qué Se Hizo

Se implementó un servidor WebSocket con la librería `ws` y una interfaz web capaz de mantener comunicación bidireccional en tiempo real. Sobre esa base se añadieron nueve retos funcionales:

- Envío de imágenes.
- Envío de archivos.
- Visualización de usuarios conectados.
- Notificaciones de conexión y desconexión.
- Historial temporal por sala.
- Salas o canales.
- Indicador de escritura.
- Reconexión básica.
- Pizarra online colaborativa.

## Tecnologías

- Node.js
- WebSockets (`ws`)
- HTML
- CSS
- JavaScript

## Estructura Del Proyecto

- `servidor/`: servidor principal WebSocket.
- `interfaz/`: cliente web integrado.
- `retos/reto1` a `retos/reto9`: implementación separada de cada reto.
- `evidencias/`: material de apoyo y capturas.

## Cómo Ejecutarlo

1. Ingresar a la carpeta del servidor:

   ```bash
   cd servidor
   ```

2. Instalar dependencias:

   ```bash
   npm install
   ```

3. Iniciar el proyecto:

   ```bash
   npm start
   ```

4. Abrir en el navegador:

   ```text
   http://localhost:8080
   ```

5. Abrir varias pestañas para probar la comunicación en tiempo real.

## Funcionalidades Principales

- Comunicación persistente cliente-servidor.
- Mensajes en tiempo real sin recargar la página.
- Manejo de múltiples usuarios por sala.
- Transferencia de imágenes y archivos.
- Recuperación básica ante pérdida de conexión.
- Sincronización de trazos en una pizarra compartida.

## Estado Del Proyecto

El proyecto cumple con los 9 retos planteados en el laboratorio y demuestra el uso de WebSockets en un entorno distribuido interactivo.
