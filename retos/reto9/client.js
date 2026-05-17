function line(ctx, draw, canvas) {
  ctx.strokeStyle = draw.color || "#1f2a36";
  ctx.lineWidth = draw.size || 2;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(draw.x0 * canvas.width, draw.y0 * canvas.height);
  ctx.lineTo(draw.x1 * canvas.width, draw.y1 * canvas.height);
  ctx.stroke();
}

export function setupBoard(canvas, clearBtn, sendFn) {
  const ctx = canvas.getContext("2d");
  let drawing = false;
  let prev = null;

  function pos(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height,
    };
  }

  canvas.addEventListener("pointerdown", (event) => {
    drawing = true;
    prev = pos(event);
  });

  canvas.addEventListener("pointerup", () => {
    drawing = false;
    prev = null;
  });

  canvas.addEventListener("pointerleave", () => {
    drawing = false;
    prev = null;
  });

  canvas.addEventListener("pointermove", (event) => {
    if (!drawing || !prev) {
      return;
    }

    const current = pos(event);
    const draw = {
      x0: prev.x,
      y0: prev.y,
      x1: current.x,
      y1: current.y,
      color: "#1f2a36",
      size: 2,
    };

    line(ctx, draw, canvas);
    sendFn({ type: "board-draw", draw });
    prev = current;
  });

  clearBtn.addEventListener("click", () => {
    clearBoard(canvas);
    sendFn({ type: "board-clear" });
  });

  return {
    drawRemote(draw) {
      line(ctx, draw, canvas);
    },
    clear() {
      clearBoard(canvas);
    },
    renderSnapshot(events) {
      clearBoard(canvas);
      for (const draw of events) {
        line(ctx, draw, canvas);
      }
    },
  };
}

export function clearBoard(canvas) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
