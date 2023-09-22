"use client";

import { useState } from "react";
import { flushSync } from "react-dom";

const MIN_VOLUME = 0.05;
export default function Home() {
  const [isBig, setIsBig] = useState(false);

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
