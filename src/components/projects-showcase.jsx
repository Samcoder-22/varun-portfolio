"use client";

import Image from "next/image";
import { useState } from "react";

function getPlanetTexture(textureType, color) {
  const glow = `color-mix(in srgb, ${color} 28%, white)`;
  const shadow = `color-mix(in srgb, ${color} 50%, black)`;

  const textures = {
    rings: `
      radial-gradient(circle at 30% 30%, ${glow} 0%, ${color} 38%, ${shadow} 72%, #020617 100%),
      linear-gradient(135deg, transparent 42%, color-mix(in srgb, ${color} 65%, white) 49%, transparent 56%)
    `,
    craters: `
      radial-gradient(circle at 32% 30%, ${glow} 0%, ${color} 42%, ${shadow} 72%, #020617 100%),
      radial-gradient(circle at 40% 42%, rgba(0, 0, 0, 0.3) 0 8%, transparent 9%),
      radial-gradient(circle at 68% 30%, rgba(255, 255, 255, 0.12) 0 6%, transparent 7%),
      radial-gradient(circle at 58% 68%, rgba(0, 0, 0, 0.25) 0 10%, transparent 11%)
    `,
    grid: `
      radial-gradient(circle at 32% 30%, ${glow} 0%, ${color} 40%, ${shadow} 76%, #020617 100%),
      repeating-linear-gradient(0deg, transparent 0 18px, rgba(255, 255, 255, 0.08) 18px 19px),
      repeating-linear-gradient(90deg, transparent 0 18px, rgba(255, 255, 255, 0.08) 18px 19px)
    `,
    bands: `
      radial-gradient(circle at 34% 28%, ${glow} 0%, ${color} 38%, ${shadow} 78%, #1f1710 100%),
      repeating-linear-gradient(
        10deg,
        rgba(121, 92, 59, 0.52) 0 18px,
        rgba(237, 223, 190, 0.18) 18px 32px,
        rgba(92, 68, 44, 0.4) 32px 48px
      )
    `,
  };

  return textures[textureType] ?? textures.rings;
}

function ProjectMedia({ title, thumbnailUrl, videoUrl }) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-white/12 bg-white/5 shadow-[0_0_40px_rgba(20,184,212,0.12)]">
      {isPlaying ? (
        <iframe
          title={title}
          src={videoUrl}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsPlaying(true)}
          className="group relative h-full w-full cursor-pointer"
          aria-label={`Play video for ${title}`}
        >
          <Image
            src={thumbnailUrl}
            alt={`${title} thumbnail`}
            fill
            sizes="(min-width: 1024px) 56vw, 100vw"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          />
          <span className="absolute inset-0 bg-black/45" />
          <span className="absolute inset-x-0 bottom-6 flex justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-black/65 text-primary backdrop-blur-sm transition group-hover:bg-black/75">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="ml-0.5 h-6 w-6 fill-current"
              >
                <path d="M8 6.5v11l9-5.5-9-5.5Z" />
              </svg>
            </span>
          </span>
        </button>
      )}
    </div>
  );
}

function ProjectSection({
  id,
  title,
  brief,
  thumbnailUrl,
  videoUrl,
  planetColor,
  planetSize,
  textureType,
  isPlanetLeft,
}) {
  const planetDiameter = planetSize * 2;
  const mobilePlanetDiameter = Math.max(160, Math.floor(planetDiameter * 0.42));

  return (
    <section
      id={id}
      className="relative isolate flex min-h-dvh items-center overflow-hidden bg-transparent px-6 py-12 sm:px-8 lg:px-12"
    >
      <div
        className="pointer-events-none absolute top-1/2 hidden -translate-y-1/2 lg:block"
        style={{
          width: `${planetDiameter}px`,
          height: `${planetDiameter}px`,
          left: isPlanetLeft ? `calc(-6rem - ${planetSize / 2}px)` : "auto",
          right: isPlanetLeft ? "auto" : `calc(-6rem - ${planetSize / 2}px)`,
          borderRadius: "9999px",
          backgroundImage: getPlanetTexture(textureType, planetColor),
          boxShadow: `0 0 120px color-mix(in srgb, ${planetColor} 28%, transparent)`,
        }}
        aria-hidden="true"
      />

      <div className="absolute inset-x-0 top-10 flex justify-center lg:hidden" aria-hidden="true">
        <div
          className="opacity-70"
          style={{
            width: `${mobilePlanetDiameter}px`,
            height: `${mobilePlanetDiameter}px`,
            borderRadius: "9999px",
            backgroundImage: getPlanetTexture(textureType, planetColor),
            boxShadow: `0 0 40px color-mix(in srgb, ${planetColor} 24%, transparent)`,
          }}
        />
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(360px,1.15fr)] lg:items-center lg:gap-16">
        <div
          className={`pt-28 lg:pt-0 ${
            isPlanetLeft ? "lg:order-1 lg:text-left" : "lg:order-2 lg:text-right"
          }`}
        >
          <div className={`max-w-2xl ${isPlanetLeft ? "" : "lg:ml-auto"}`}>
            <h2
              className={`font-heading text-4xl font-semibold text-white [text-shadow:0_4px_18px_rgba(0,0,0,0.9)] sm:text-5xl ${
                isPlanetLeft ? "max-w-xl" : "max-w-xl lg:ml-auto"
              }`}
            >
              {title}
            </h2>
            <p
              className={`mt-5 text-base leading-7 text-white/80 [text-shadow:0_2px_16px_rgba(0,0,0,0.92)] sm:text-lg ${
                isPlanetLeft ? "max-w-xl" : "max-w-xl lg:ml-auto"
              }`}
            >
              {brief}
            </p>
          </div>
        </div>

        <div className={isPlanetLeft ? "lg:order-2" : "lg:order-1"}>
          <ProjectMedia
            title={title}
            thumbnailUrl={thumbnailUrl}
            videoUrl={videoUrl}
          />
        </div>
      </div>
    </section>
  );
}

export default function ProjectsShowcase({ projects }) {
  return (
    <>
      {projects.map((project, index) => (
        <ProjectSection
          key={project.id}
          {...project}
          isPlanetLeft={index % 2 === 0}
        />
      ))}
    </>
  );
}
