"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, Play, Volume2 } from "lucide-react";

interface VideoFeatureProps {
  videoId: string;
  title: string;
}

/**
 * 三态自动播放视频组件：
 * - idle: 显示缩略图 + 播放按钮（不加载 iframe，省带宽）
 * - auto: 进入视口后自动静音循环播放（IntersectionObserver 阈值 0.5）
 * - manual: 用户点击播放/喇叭后带声播放
 */
export function VideoFeature({ videoId, title }: VideoFeatureProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"idle" | "auto" | "manual">("idle");

  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const thumb = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  const embedBase = `https://www.youtube.com/embed/${videoId}`;
  const src =
    mode === "manual"
      ? `${embedBase}?autoplay=1&mute=0&playsinline=1&rel=0`
      : `${embedBase}?autoplay=1&mute=1&loop=1&playlist=${videoId}&playsinline=1&rel=0`;

  // 进入视口（可见面积 >= 50%）自动切到 auto 态
  useEffect(() => {
    if (mode !== "idle") return;
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setMode("auto");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            setMode("auto");
            io.disconnect();
          }
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [mode]);

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-lg bg-black"
        style={{ paddingBottom: "56.25%" }}
      >
        {mode === "idle" ? (
          <button
            type="button"
            onClick={() => setMode("manual")}
            className="absolute inset-0 h-full w-full"
            aria-label={`Play ${title}`}
          >
            <img
              src={thumb}
              alt={title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors hover:bg-black/20">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[hsl(var(--nav-theme))] shadow-lg ring-4 ring-white/20 transition-transform hover:scale-110 md:h-16 md:w-16">
                <Play className="ml-1 h-6 w-6 fill-white text-white md:h-7 md:w-7" />
              </span>
            </span>
          </button>
        ) : (
          <>
            <iframe
              className="absolute left-0 top-0 h-full w-full"
              src={src}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
            {mode === "auto" && (
              <button
                type="button"
                onClick={() => setMode("manual")}
                className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-md bg-black/70 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-black/90"
              >
                <Volume2 className="h-4 w-4" />
                Tap for sound
              </button>
            )}
          </>
        )}
      </div>

      <div className="flex justify-center">
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
        >
          Watch on YouTube
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
