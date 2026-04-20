"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import type { Restaurant } from "@/data/restaurants";
import { t, type Lang } from "@/i18n";

const COLORS = [
  "#e74c3c", "#3498db", "#2ecc71", "#9b59b6", "#e67e22", "#1abc9c",
  "#d63031", "#0984e3", "#00b894", "#6c5ce7", "#e84393", "#00cec9",
];

const SIZE = 600;
const MIN_FLICK_VELOCITY = 2; // radians/sec to trigger spin

interface Props {
  restaurants: Restaurant[];
  onResult: (r: Restaurant) => void;
  onSpinningChange?: (spinning: boolean) => void;
  lang: Lang;
}

export default function SpinWheel({ restaurants, onResult, onSpinningChange, lang }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(0);
  const isSpinningRef = useRef(false);
  const frameRef = useRef(0);
  const [spinning, setSpinning] = useState(false);
  const [dragging, setDragging] = useState(false);

  // Drag state
  const dragRef = useRef({
    active: false,
    offsetAngle: 0,
    lastAngle: 0,
    lastTime: 0,
    velocity: 0,
  });

  // ── Drawing ─────────────────────────────────────────

  const draw = useCallback(
    (items: Restaurant[], rotation: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const n = items.length;
      if (n === 0) {
        ctx.clearRect(0, 0, SIZE, SIZE);
        ctx.fillStyle = "#1a1a2e";
        ctx.beginPath();
        ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2 - 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#666";
        ctx.font = "bold 18px Kanit, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(t("noRestaurants", lang), SIZE / 2, SIZE / 2);
        return;
      }

      const center = SIZE / 2;
      const radius = center - 20;
      const segAngle = (2 * Math.PI) / n;

      ctx.clearRect(0, 0, SIZE, SIZE);

      // Outer ring glow
      ctx.beginPath();
      ctx.arc(center, center, radius + 8, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(245, 158, 11, 0.3)";
      ctx.lineWidth = 4;
      ctx.stroke();

      // Segments
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(rotation);

      const fontSize = Math.max(7, Math.min(13, 280 / n));

      for (let i = 0; i < n; i++) {
        const start = -Math.PI / 2 + i * segAngle;
        const end = start + segAngle;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, start, end);
        ctx.closePath();
        ctx.fillStyle = COLORS[i % COLORS.length];
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.15)";
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.save();
        ctx.rotate(start + segAngle / 2);
        ctx.font = `bold ${fontSize}px Kanit, sans-serif`;
        ctx.fillStyle = "#fff";
        ctx.textAlign = "right";
        ctx.shadowColor = "rgba(0,0,0,0.6)";
        ctx.shadowBlur = 3;

        let name = items[i].name;
        const maxLen = Math.floor((radius - 45) / (fontSize * 0.55));
        if (name.length > maxLen && maxLen > 2) name = name.slice(0, maxLen - 1) + "\u2026";

        ctx.fillText(name, radius - 15, fontSize / 3);
        ctx.shadowBlur = 0;
        ctx.restore();
      }

      ctx.restore();

      // Center hub
      const grad = ctx.createRadialGradient(center, center, 0, center, center, 30);
      grad.addColorStop(0, "#2d3436");
      grad.addColorStop(1, "#1a1a2e");
      ctx.beginPath();
      ctx.arc(center, center, 28, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = "#f59e0b";
      ctx.font = "bold 11px Kanit, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("OBK", center, center + 4);

      // Pointer
      ctx.beginPath();
      ctx.moveTo(center, 10);
      ctx.lineTo(center - 14, -12);
      ctx.lineTo(center + 14, -12);
      ctx.closePath();
      ctx.fillStyle = "#f59e0b";
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();
    },
    [lang]
  );

  // ── Spin animation (shared by button & drag) ───────

  const spinInternal = useCallback(
    (extraSpinCount: number, duration: number) => {
      if (isSpinningRef.current || restaurants.length === 0) return;

      isSpinningRef.current = true;
      setSpinning(true);
      onSpinningChange?.(true);

      const items = restaurants;
      const n = items.length;
      const segAngle = (2 * Math.PI) / n;

      const winner = Math.floor(Math.random() * n);
      const jitter = (Math.random() - 0.5) * segAngle * 0.5;

      const currentRot = rotationRef.current;
      const currentNorm = ((currentRot % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
      const targetNorm =
        ((2 * Math.PI - (winner * segAngle + segAngle / 2 + jitter)) % (2 * Math.PI) + 2 * Math.PI) %
        (2 * Math.PI);
      let diff = ((targetNorm - currentNorm) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
      if (diff < segAngle) diff += 2 * Math.PI;

      const extraSpins = extraSpinCount * 2 * Math.PI;
      const targetRot = currentRot + diff + extraSpins;
      const startRot = currentRot;
      const startTime = performance.now();

      let audioCtx: AudioContext | null = null;
      try { audioCtx = new AudioContext(); } catch { /* no audio */ }
      let lastSeg = -1;

      function tick() {
        if (!audioCtx) return;
        try {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.frequency.value = 500 + Math.random() * 400;
          osc.type = "sine";
          gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.03);
        } catch { /* skip */ }
      }

      function animate(time: number) {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);

        const currentAngle = startRot + (targetRot - startRot) * eased;
        rotationRef.current = currentAngle;
        draw(items, currentAngle);

        const norm = ((currentAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        const seg = Math.floor(((2 * Math.PI - norm) % (2 * Math.PI)) / segAngle) % n;
        if (seg !== lastSeg) {
          lastSeg = seg;
          if (progress < 0.92) tick();
        }

        if (progress < 1) {
          frameRef.current = requestAnimationFrame(animate);
        } else {
          isSpinningRef.current = false;
          setSpinning(false);
          onSpinningChange?.(false);
          audioCtx?.close().catch(() => {});
          onResult(items[winner]);
        }
      }

      frameRef.current = requestAnimationFrame(animate);
    },
    [restaurants, draw, onResult, onSpinningChange]
  );

  const spin = useCallback(() => {
    spinInternal(6 + Math.floor(Math.random() * 4), 4500 + Math.random() * 2000);
  }, [spinInternal]);

  // ── Drag-to-spin ───────────────────────────────────

  function getAngle(clientX: number, clientY: number): number {
    const canvas = canvasRef.current;
    if (!canvas) return 0;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left - rect.width / 2;
    const y = clientY - rect.top - rect.height / 2;
    return Math.atan2(y, x);
  }

  function onDragStart(clientX: number, clientY: number) {
    if (isSpinningRef.current || restaurants.length === 0) return;
    const angle = getAngle(clientX, clientY);
    dragRef.current = {
      active: true,
      offsetAngle: angle - rotationRef.current,
      lastAngle: angle,
      lastTime: performance.now(),
      velocity: 0,
    };
    setDragging(true);
  }

  function onDragMove(clientX: number, clientY: number) {
    const d = dragRef.current;
    if (!d.active) return;

    const angle = getAngle(clientX, clientY);
    const now = performance.now();
    const dt = now - d.lastTime;

    if (dt > 0) {
      let dAngle = angle - d.lastAngle;
      if (dAngle > Math.PI) dAngle -= 2 * Math.PI;
      if (dAngle < -Math.PI) dAngle += 2 * Math.PI;
      const instant = dAngle / (dt / 1000);
      d.velocity = d.velocity * 0.3 + instant * 0.7;
    }

    d.lastAngle = angle;
    d.lastTime = now;

    rotationRef.current = angle - d.offsetAngle;
    draw(restaurants, rotationRef.current);
  }

  function onDragEnd() {
    const d = dragRef.current;
    if (!d.active) return;
    d.active = false;
    setDragging(false);

    const absV = Math.abs(d.velocity);
    if (absV > MIN_FLICK_VELOCITY) {
      const spins = Math.min(10, Math.max(3, Math.floor(absV / 2)));
      const dur = Math.min(7000, Math.max(3000, spins * 700));
      spinInternal(spins, dur);
    }
  }

  // Mouse events on canvas
  const handleMouseDown = (e: React.MouseEvent) => onDragStart(e.clientX, e.clientY);

  // Touch events on canvas
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      onDragStart(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  // Global move/end events (so dragging works outside canvas bounds)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => onDragMove(e.clientX, e.clientY);
    const handleMouseUp = () => onDragEnd();
    const handleTouchMove = (e: TouchEvent) => {
      if (dragRef.current.active && e.touches.length === 1) {
        e.preventDefault();
        onDragMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const handleTouchEnd = () => onDragEnd();

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  });

  // ── Lifecycle ──────────────────────────────────────

  useEffect(() => {
    rotationRef.current = 0;
    draw(restaurants, 0);
  }, [restaurants, draw]);

  useEffect(() => {
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  // ── Render ─────────────────────────────────────────

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-full max-w-[500px] mx-auto">
        <canvas
          ref={canvasRef}
          width={SIZE}
          height={SIZE}
          className="w-full h-auto touch-none"
          style={{ cursor: spinning ? "not-allowed" : dragging ? "grabbing" : "grab" }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        />
      </div>

      <button
        onClick={spin}
        disabled={spinning || restaurants.length === 0}
        className={`
          px-12 py-4 rounded-full text-xl font-bold tracking-wider
          transition-all duration-200 select-none
          ${
            spinning
              ? "bg-gray-700 text-gray-400 cursor-not-allowed scale-95"
              : "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-400 hover:to-orange-400 hover:scale-105 active:scale-95 shadow-lg shadow-amber-500/25 cursor-pointer"
          }
        `}
      >
        {spinning ? t("spinning", lang) : t("spin", lang)}
      </button>
    </div>
  );
}
