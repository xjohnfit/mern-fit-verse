"use client";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { createNoise3D } from "simplex-noise";

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth,
  backgroundFill,
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  ...props
}: {
  children?: any;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
  [key: string]: any;
}) => {
  const noise = createNoise3D();
  let w: number,
    h: number,
    nt: number,
    i: number,
    x: number,
    ctx: any,
    canvas: any;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const getSpeed = () => {
    switch (speed) {
      case "slow":
        return 0.001;
      case "fast":
        return 0.002;
      default:
        return 0.001;
    }
  };

  const init = () => {
    canvas = canvasRef.current;
    if (!canvas) return;

    ctx = canvas.getContext("2d");
    const container = canvas.parentElement;
    if (!container) return;

    // Use container dimensions instead of window dimensions for better mobile support
    const rect = container.getBoundingClientRect();
    w = ctx.canvas.width = rect.width;
    h = ctx.canvas.height = rect.height;
    ctx.filter = `blur(${blur}px)`;
    nt = 0;

    let resizeTimeout: number;
    const handleResize = () => {
      // Debounce resize events for better mobile performance
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (!canvas || !container) return;
        const rect = container.getBoundingClientRect();
        w = ctx.canvas.width = rect.width;
        h = ctx.canvas.height = rect.height;
        ctx.filter = `blur(${blur}px)`;
      }, 100);
    };

    const handleOrientationChange = () => {
      // Handle orientation change with a longer delay for mobile
      setTimeout(handleResize, 300);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    // Set cleanup function for event listeners
    cleanupResize = () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };

    render();
  };

  const waveColors = colors ?? [
    "#38bdf8",
    "#818cf8",
    "#c084fc",
    "#e879f9",
    "#22d3ee",
  ];
  const drawWave = (n: number) => {
    nt += getSpeed();
    for (i = 0; i < n; i++) {
      ctx.beginPath();
      ctx.lineWidth = waveWidth || 50;
      ctx.strokeStyle = waveColors[i % waveColors.length];
      for (x = 0; x < w; x += 5) {
        var y = noise(x / 800, 0.3 * i, nt) * 100;
        ctx.lineTo(x, y + h * 0.5); // adjust for height, currently at 50% of the container
      }
      ctx.stroke();
      ctx.closePath();
    }
  };

  let animationId: number;
  let cleanupResize: (() => void) | null = null;

  const render = () => {
    ctx.fillStyle = backgroundFill || "black";
    ctx.globalAlpha = waveOpacity || 0.5;
    ctx.fillRect(0, 0, w, h);
    drawWave(5);
    animationId = requestAnimationFrame(render);
  };

  useEffect(() => {
    init();
    return () => {
      cancelAnimationFrame(animationId);
      // Cleanup resize listeners
      if (cleanupResize) {
        cleanupResize();
      }
    };
  }, []);

  const [isSafari, setIsSafari] = useState(false);
  useEffect(() => {
    // I'm sorry but i have got to support it on safari.
    setIsSafari(
      typeof window !== "undefined" &&
      navigator.userAgent.includes("Safari") &&
      !navigator.userAgent.includes("Chrome")
    );
  }, []);

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center overflow-hidden",
        containerClassName
      )}
      style={{
        minHeight: '100vh',
        WebkitOverflowScrolling: 'touch' // Smooth scrolling on iOS
      }}
    >
      <canvas
        className="absolute inset-0 z-0 w-full h-full"
        ref={canvasRef}
        id="canvas"
        style={{
          ...(isSafari ? { filter: `blur(${blur}px)` } : {}),
          touchAction: 'none', // Prevent default touch behaviors that can interfere
          pointerEvents: 'none', // Prevent canvas from intercepting touch events
        }}
      ></canvas>
      {/* Use box-shadow insets to hide blur borders without blocking animation */}
      <div
        className="absolute inset-0 z-1 md:hidden pointer-events-none"
        style={{
          boxShadow: 'inset 8px 0 0 black, inset -8px 0 0 black, inset 0 -8px 0 black'
        }}
      ></div>
      <div className={cn("relative z-10 px-4 py-16", className)} {...props}>
        {children}
      </div>
    </div>
  );
};
