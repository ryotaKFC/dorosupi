"use client";

import { useEffect, useRef, useState } from "react";

interface RaceTrackProps {
  player1Image: string;
  player2Image: string;
  player1Position: number;
  player2Position: number;
  player1Wobble: number;
  player2Wobble: number;
  winner: number | null;
}

export function RaceTrack({
  player1Image,
  player2Image,
  player1Position,
  player2Position,
  player1Wobble,
  player2Wobble,
  winner,
}: RaceTrackProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const player1ImageRef = useRef<HTMLImageElement | null>(null);
  const player2ImageRef = useRef<HTMLImageElement | null>(null);
  const animationFrameRef = useRef<number>(0);
  const [idleTime, setIdleTime] = useState(0);

  useEffect(() => {
    const img1 = new Image();
    img1.crossOrigin = "anonymous";
    img1.src = player1Image;
    img1.onload = () => {
      player1ImageRef.current = img1;
    };

    const img2 = new Image();
    img2.crossOrigin = "anonymous";
    img2.src = player2Image;
    img2.onload = () => {
      player2ImageRef.current = img2;
    };
  }, [player1Image, player2Image]);

  useEffect(() => {
    if (winner) return;

    let lastTime = 0;
    const animate = (time: number) => {
      if (lastTime === 0) lastTime = time;
      const delta = time - lastTime;
      lastTime = time;

      setIdleTime((prev) => prev + delta * 0.005);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [winner]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Sky
    ctx.fillStyle = "#87CEEB";
    ctx.fillRect(0, 0, width, height * 0.4);

    // Sun
    ctx.fillStyle = "#FFD93D";
    ctx.beginPath();
    ctx.arc(width - 80, 60, 40, 0, Math.PI * 2);
    ctx.fill();

    // Clouds
    ctx.fillStyle = "#ffffff";
    drawCloud(ctx, 100, 50, 30);
    drawCloud(ctx, 300, 80, 25);
    drawCloud(ctx, 500, 40, 35);

    // Grass
    ctx.fillStyle = "#4CAF50";
    ctx.fillRect(0, height * 0.4, width, height * 0.15);

    // Track
    ctx.fillStyle = "#DEB887";
    ctx.fillRect(0, height * 0.55, width, height * 0.35);

    // Track lines
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 4;
    ctx.setLineDash([20, 20]);

    // Start line
    ctx.beginPath();
    ctx.moveTo(60, height * 0.55);
    ctx.lineTo(60, height * 0.9);
    ctx.stroke();

    // Finish line
    ctx.setLineDash([]);
    ctx.lineWidth = 8;
    ctx.strokeStyle = "#FF6B6B";
    ctx.beginPath();
    ctx.moveTo(width - 60, height * 0.55);
    ctx.lineTo(width - 60, height * 0.9);
    ctx.stroke();

    // Goal flag
    ctx.fillStyle = "#FF6B6B";
    ctx.font = "bold 40px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("🏁", width - 60, height * 0.48);

    // Lane divider
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.setLineDash([15, 15]);
    ctx.beginPath();
    ctx.moveTo(0, height * 0.725);
    ctx.lineTo(width, height * 0.725);
    ctx.stroke();
    ctx.setLineDash([]);

    // Calculate positions
    const startX = 60;
    const endX = width - 120;
    const trackWidth = endX - startX;

    const p1X = startX + (player1Position / 100) * trackWidth;
    const p2X = startX + (player2Position / 100) * trackWidth;

    const p1Y = height * 0.62;
    const p2Y = height * 0.8;

    const charSize = 70;

    // Draw players with wobble effect
    if (player1ImageRef.current) {
      ctx.save();
      ctx.translate(p1X + charSize / 2, p1Y + charSize / 2);

      const idleScale = 1 + Math.sin(idleTime * 2) * 0.08;
      const idleRotation = Math.sin(idleTime * 1.5) * 0.1;
      const idleSkew = Math.sin(idleTime * 1.8) * 0.05;

      const inputScale = Math.sin(player1Wobble * 0.5) * 0.12;
      const inputRotation = Math.sin(player1Wobble * 0.3) * 0.15;
      const inputSkew = Math.sin(player1Wobble * 0.4) * 0.08;

      const totalScale = idleScale + inputScale;
      const totalRotation = idleRotation + inputRotation;
      const totalSkew = idleSkew + inputSkew;

      ctx.rotate(totalRotation);
      ctx.transform(1, totalSkew, totalSkew, totalScale, 0, 0);
      ctx.drawImage(
        player1ImageRef.current,
        -charSize / 2,
        -charSize / 2,
        charSize,
        charSize,
      );
      ctx.restore();
    }

    if (player2ImageRef.current) {
      ctx.save();
      ctx.translate(p2X + charSize / 2, p2Y + charSize / 2);

      const idleScale = 1 + Math.sin(idleTime * 2 + 1) * 0.08;
      const idleRotation = Math.sin(idleTime * 1.5 + 0.5) * 0.1;
      const idleSkew = Math.sin(idleTime * 1.8 + 0.3) * 0.05;

      const inputScale = Math.sin(player2Wobble * 0.5) * 0.12;
      const inputRotation = Math.sin(player2Wobble * 0.3) * 0.15;
      const inputSkew = Math.sin(player2Wobble * 0.4) * 0.08;

      const totalScale = idleScale + inputScale;
      const totalRotation = idleRotation + inputRotation;
      const totalSkew = idleSkew + inputSkew;

      ctx.rotate(totalRotation);
      ctx.transform(1, totalSkew, totalSkew, totalScale, 0, 0);
      ctx.drawImage(
        player2ImageRef.current,
        -charSize / 2,
        -charSize / 2,
        charSize,
        charSize,
      );
      ctx.restore();
    }

    // Draw lane labels
    ctx.font = "bold 28px sans-serif";
    ctx.textAlign = "left";
    ctx.fillStyle = "#FF6B6B";
    ctx.fillText("1", 15, height * 0.67);
    ctx.fillStyle = "#4A90D9";
    ctx.fillText("2", 15, height * 0.85);

    // Winner celebration
    if (winner) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      ctx.fillRect(0, 0, width, height);

      ctx.font = "bold 60px sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = winner === 1 ? "#FF6B6B" : "#4A90D9";
      ctx.fillText(`${winner}のかち!`, width / 2, height / 2 - 20);

      ctx.font = "80px sans-serif";
      ctx.fillText("🎉", width / 2, height / 2 + 60);
    }
  }, [player1Position, player2Position, player1Wobble, player2Wobble, winner, idleTime]);

  return (
    <canvas
      ref={canvasRef}
      width={1000}
      height={550}
      className="w-full max-w-5xl rounded-3xl border-4 border-gray-700 shadow-xl"
    />
  );
}

function drawCloud(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
) {
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.arc(x + size * 0.8, y - size * 0.3, size * 0.7, 0, Math.PI * 2);
  ctx.arc(x + size * 1.5, y, size * 0.9, 0, Math.PI * 2);
  ctx.fill();
}
