"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

const MIN_VOLUME = 0.05;
export default function Home() {
  const [isBig, setIsBig] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (buttonRef.current) {
      let volume = MIN_VOLUME;
      let opacity = 0.3;

      const rect = buttonRef.current.getBoundingClientRect();
      const rectPosition = {
        x: rect.x + rect.width / 2,
        y: rect.y + rect.height / 2,
      };

      const xDiff = rectPosition.x - mousePosition.x;
      const yDiff = rectPosition.y - mousePosition.y;

      const distance = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
      console.log(distance);

      if (distance < 700) {
        var start1 = 100;
        var stop1 = 700;
        var start2 = 1;
        var stop2 = 0;
        const mappedValue =
          ((distance - start1) / (stop1 - start1)) * (stop2 - start2) + start2;

        volume = mappedValue;
        opacity = mappedValue;
      }

      const video = document.getElementById("video");
      if (video) {
        (video as HTMLVideoElement).style.opacity = Math.max(
          opacity,
          0.3
        ).toString();
        (video as HTMLVideoElement).volume = volume > 1 ? 1 : volume;
        (video as HTMLVideoElement).style.filter = `grayscale(${
          1 - opacity - 0.2
        })`;
      }
    }
  }, [mousePosition]);

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center p-24"
      onClick={() => {
        const video = document.getElementById("video");
        if (video) {
          (video as HTMLVideoElement).play();
          (video as HTMLVideoElement).volume = MIN_VOLUME;
        }
      }}
      onMouseMove={(e) => {
        setMousePosition({ x: e.clientX, y: e.clientY });
      }}
    >
      <div
        className={`btn ${isBig ? "big" : "small"}`}
        onClick={() => {
          // @ts-expect-error
          document.startViewTransition(() => {
            flushSync(() => {
              setIsBig((prev) => !prev);
              const video = document.getElementById("video");
              if (video) {
                (video as HTMLVideoElement).play();
                (video as HTMLVideoElement).volume = 1;
              }
            });
          });
        }}
        ref={buttonRef}
        onMouseEnter={() => {
          const video = document.getElementById("video");
          // @ts-expect-error
          let intervalId;

          const frame = () => {
            console.log("frame enter");
            if (video) {
              const nextValue = (video as HTMLVideoElement).volume + 0.1;

              if (nextValue > 1) {
                // @ts-expect-error
                clearInterval(intervalId);
                return;
              }
              if (isBig) {
                (video as HTMLVideoElement).volume = 1;
                // @ts-expect-error
                clearInterval(intervalId);
                return;
              }
              (video as HTMLVideoElement).volume = nextValue;
            }
          };

          intervalId = setInterval(frame, 100);
        }}
        onMouseLeave={() => {
          const video = document.getElementById("video");
          // @ts-expect-error
          let intervalId;

          const frame = () => {
            console.log("frame leave");
            if (video) {
              const nextValue = (video as HTMLVideoElement).volume - MIN_VOLUME;

              if (nextValue < MIN_VOLUME || isBig) {
                // @ts-expect-error
                clearInterval(intervalId);
                return;
              }
              (video as HTMLVideoElement).volume = nextValue;
            }
          };

          intervalId = setInterval(frame, 10);
        }}
      >
        <div className="label">Watch</div>
        <video autoPlay loop id="video">
          <source src="/starwars.mp4" type="video/mp4" />
        </video>
      </div>
    </main>
  );
}
