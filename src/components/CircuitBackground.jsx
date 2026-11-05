import { useEffect, useRef } from "react";

function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function build(width, height) {
  const gap = width < 700 ? 104 : 88;
  const rand = mulberry32(20261104);
  const cols = Math.ceil(width / gap) + 1;
  const rows = Math.ceil(height / gap) + 1;
  const nodes = [];

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      if (rand() > 0.7) continue;
      nodes.push({
        x: col * gap + (rand() - 0.5) * 8,
        y: row * gap + (rand() - 0.5) * 8,
        pad: rand() > 0.84,
      });
    }
  }

  const edges = [];
  for (let i = 0; i < nodes.length; i += 1) {
    let right = -1;
    let rightDx = Infinity;
    let down = -1;
    let downDy = Infinity;
    for (let j = 0; j < nodes.length; j += 1) {
      if (i === j) continue;
      const dx = nodes[j].x - nodes[i].x;
      const dy = nodes[j].y - nodes[i].y;
      if (dx > 28 && dx < gap * 1.5 && Math.abs(dy) < 18 && dx < rightDx) {
        right = j;
        rightDx = dx;
      }
      if (dy > 28 && dy < gap * 1.5 && Math.abs(dx) < 18 && dy < downDy) {
        down = j;
        downDy = dy;
      }
    }
    if (right >= 0) edges.push([i, right]);
    if (down >= 0) edges.push([i, down]);
  }

  const pulses = [];
  const count = Math.min(12, edges.length);
  for (let i = 0; i < count; i += 1) {
    pulses.push({
      edge: Math.floor(rand() * Math.max(edges.length, 1)),
      t: rand(),
      speed: 0.0016 + rand() * 0.0028,
    });
  }

  return { nodes, edges, pulses };
}

function pointSegmentDistance(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const lengthSq = dx * dx + dy * dy || 1;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lengthSq));
  const x = ax + t * dx;
  const y = ay + t * dy;
  return Math.hypot(px - x, py - y);
}

export function CircuitBackground() {
  const canvasRef = useRef(null);
  const modelRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return undefined;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const running = { current: true };

    const fit = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      modelRef.current = build(width, height);
    };

    const draw = () => {
      const model = modelRef.current;
      if (!model) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      context.clearRect(0, 0, width, height);
      const mouse = mouseRef.current;

      for (const [from, to] of model.edges) {
        const a = model.nodes[from];
        const b = model.nodes[to];
        const distance = pointSegmentDistance(mouse.x, mouse.y, a.x, a.y, b.x, b.y);
        const glow = Math.max(0, 1 - distance / 170);
        context.beginPath();
        context.moveTo(a.x, a.y);
        context.lineTo(b.x, b.y);
        context.strokeStyle = glow > 0.05 ? `rgba(94, 231, 255, ${0.18 + glow * 0.7})` : "rgba(76, 141, 255, 0.22)";
        context.lineWidth = glow > 0.2 ? 1.6 : 1;
        context.stroke();
      }

      for (const node of model.nodes) {
        const distance = Math.hypot(node.x - mouse.x, node.y - mouse.y);
        const glow = Math.max(0, 1 - distance / 150);
        context.beginPath();
        context.arc(node.x, node.y, node.pad ? 2.4 : 1.7, 0, Math.PI * 2);
        context.fillStyle = `rgba(214, 246, 255, ${0.35 + glow * 0.65})`;
        context.fill();
        if (node.pad) {
          context.strokeStyle = `rgba(94, 231, 255, ${0.35 + glow * 0.5})`;
          context.strokeRect(node.x - 8, node.y - 5, 16, 10);
        }
      }

      if (!reduce) {
        for (const pulse of model.pulses) {
          const edge = model.edges[pulse.edge];
          if (!edge) continue;
          const a = model.nodes[edge[0]];
          const b = model.nodes[edge[1]];
          const x = a.x + (b.x - a.x) * pulse.t;
          const y = a.y + (b.y - a.y) * pulse.t;
          context.beginPath();
          context.arc(x, y, 2.2, 0, Math.PI * 2);
          context.fillStyle = "rgba(94, 231, 255, 0.95)";
          context.fill();
          pulse.t += pulse.speed;
          if (pulse.t > 1) pulse.t = 0;
        }
      }
    };

    const loop = () => {
      if (!running.current) return;
      draw();
      frameRef.current = window.requestAnimationFrame(loop);
    };

    const onPointer = (event) => {
      mouseRef.current = { x: event.clientX, y: event.clientY };
    };
    const onLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };
    const onResize = () => {
      fit();
      if (reduce) draw();
    };
    const onVisibility = () => {
      if (reduce) return;
      if (document.hidden) {
        running.current = false;
        window.cancelAnimationFrame(frameRef.current);
      } else if (!running.current) {
        running.current = true;
        frameRef.current = window.requestAnimationFrame(loop);
      }
    };

    fit();
    if (reduce) {
      draw();
    } else {
      window.addEventListener("pointermove", onPointer, { passive: true });
      window.addEventListener("pointerleave", onLeave);
      frameRef.current = window.requestAnimationFrame(loop);
    }
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    canvas.dataset.motion = reduce ? "reduced" : "full";

    return () => {
      running.current = false;
      window.cancelAnimationFrame(frameRef.current);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <canvas ref={canvasRef} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(7,16,24,0.55)_72%,rgba(7,16,24,0.88)_100%)]" />
    </div>
  );
}
