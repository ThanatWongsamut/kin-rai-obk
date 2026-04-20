"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import type { Restaurant } from "@/data/restaurants";
import { t, type Lang } from "@/i18n";

const COLORS = [
  "#e74c3c", "#3498db", "#2ecc71", "#9b59b6", "#e67e22", "#1abc9c",
  "#d63031", "#0984e3", "#00b894", "#6c5ce7", "#e84393", "#00cec9",
];

const SIZE = 600;

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

        // Slice
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, start, end);
        ctx.closePath();
        ctx.fillStyle = COLORS[i % COLORS.length];
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.15)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Text
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

      // Hub text
      ctx.fillStyle = "#f59e0b";
      ctx.font = "bold 11px Kanit, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("OBK", center, center + 4);

      // Pointer triangle (top)
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

  // Draw on mount & when restaurants change
  useEffect(() => {
    rotationRef.current = 0;
    draw(restaurants, 0);
  }, [restaurants, draw]);

  // Cleanup animation frame
  useEffect(() => {
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  const spin = useCallback(() => {
    if (isSpinningRef.current || restaurants.length === 0) return;

    isSpinningRef.current = true;
    setSpinning(true);
    onSpinningChange?.(true);

    const items = restaurants;
    const n = items.length;
    const segAngle = (2 * Math.PI) / n;

    // Pick winner
    const winner = Math.floor(Math.random() * n);
    const jitter = (Math.random() - 0.5) * segAngle * 0.5;

    // Calculate target rotation
    const currentRot = rotationRef.current;
    const currentNorm =
      ((currentRot % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    const targetNorm =
      ((2 * Math.PI - (winner * segAngle + segAngle / 2 + jitter)) %
        (2 * Math.PI) +
        2 * Math.PI) %
      (2 * Math.PI);
    let diff =
      ((targetNorm - currentNorm) % (2 * Math.PI) + 2 * Math.PI) %
      (2 * Math.PI);
    if (diff < segAngle) diff += 2 * Math.PI;

    const extraSpins = (6 + Math.floor(Math.random() * 4)) * 2 * Math.PI;
    const targetRot = currentRot + diff + extraSpins;
    const startRot = currentRot;
    const startTime = performance.now();
    const duration = 4500 + Math.random() * 2000;

    // Tick sound
    let audioCtx: AudioContext | null = null;
    try {
      audioCtx = new AudioContext();
    } catch {
      /* no audio */
    }
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
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          audioCtx.currentTime + 0.03
        );
        osc.start();
        osc.stop(audioCtx.currentTime + 0.03);
      } catch {
        /* skip */
      }
    }

    function animate(time: number) {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);

      const currentAngle = startRot + (targetRot - startRot) * eased;
      rotationRef.current = currentAngle;
      draw(items, currentAngle);

      // Tick on segment boundary
      const norm =
        ((currentAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
      const seg =
        Math.floor(((2 * Math.PI - norm) % (2 * Math.PI)) / segAngle) % n;
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
  }, [restaurants, draw, onResult, onSpinningChange]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-full max-w-[500px] mx-auto">
        <canvas
          ref={canvasRef}
          width={SIZE}
          height={SIZE}
          className="w-full h-auto"
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
