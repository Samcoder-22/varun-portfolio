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
          className="group relative h-full w-full"
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
          <span className="absolute inset-x-6 bottom-6 flex items-center justify-between gap-4 rounded-2xl border border-white/12 bg-black/55 px-5 py-4 text-left backdrop-blur-sm">
            <span>
              <span className="block text-sm uppercase tracking-[0.2em] text-primary/80">
                Project video
              </span>
              <span className="mt-1 block text-base font-medium text-white">
                Click to play
              </span>
            </span>
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-lg font-semibold text-black">
              Play
            </span>
          </span>
        </button>
      )}
    </div>
  );
}

function ProjectSection({
  title,
  brief,
  thumbnailUrl,
  videoUrl,
  planetColor,
  planetSize,
  textureType,
  isPlanetLeft,
}) {
  return (
    <section className="relative isolate flex min-h-dvh items-center overflow-hidden bg-background px-6 py-12 sm:px-8 lg:px-12">
      <div
        className={`pointer-events-none absolute top-1/2 hidden -translate-y-1/2 lg:block ${
          isPlanetLeft ? "-left-24" : "-right-24"
        }`}
        style={{
          width: `${planetSize}px`,
          height: `${planetSize}px`,
          borderRadius: "9999px",
          backgroundImage: getPlanetTexture(textureType, planetColor),
          boxShadow: `0 0 80px color-mix(in srgb, ${planetColor} 28%, transparent)`,
        }}
        aria-hidden="true"
      />

      <div className="absolute inset-x-0 top-10 flex justify-center lg:hidden" aria-hidden="true">
        <div
          className="opacity-70"
          style={{
            width: `${Math.max(120, Math.floor(planetSize * 0.42))}px`,
            height: `${Math.max(120, Math.floor(planetSize * 0.42))}px`,
            borderRadius: "9999px",
            backgroundImage: getPlanetTexture(textureType, planetColor),
            boxShadow: `0 0 40px color-mix(in srgb, ${planetColor} 24%, transparent)`,
          }}
        />
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(360px,1.15fr)] lg:items-center lg:gap-16">
        <div className="pt-28 lg:pt-0">
          <div className="max-w-2xl">
            <p className="mb-4 text-xs uppercase tracking-[0.28em] text-primary/75">
              Featured project
            </p>
            <h2 className="max-w-xl text-4xl font-semibold text-white sm:text-5xl">
              {title}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/72 sm:text-lg">
              {brief}
            </p>
          </div>
        </div>

        <ProjectMedia
          title={title}
          thumbnailUrl={thumbnailUrl}
          videoUrl={videoUrl}
        />
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
