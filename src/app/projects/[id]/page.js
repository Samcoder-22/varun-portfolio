import Link from "next/link";
import { notFound } from "next/navigation";

import { getProjectById, projects } from "@/data/projects";

export function generateStaticParams() {
  return projects.map((project) => ({
    id: project.id,
  }));
}

export default async function ProjectDetailPage({ params }) {
  const resolvedParams = await params;
  const project = getProjectById(resolvedParams.id);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-dvh bg-black px-6 py-10 text-white sm:px-8 lg:px-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-2 text-sm tracking-[0.2em] text-white/60 transition hover:text-white"
        >
          <span aria-hidden="true">←</span>
          <span>Back</span>
        </Link>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)] lg:items-start">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_0_40px_rgba(20,184,212,0.08)]">
            <div className="aspect-video w-full">
              <iframe
                title={project.title}
                src={project.videoUrl}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>

          <aside className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_0_40px_rgba(255,255,255,0.04)] sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">
              Project Overview
            </p>
            <h1 className="mt-4 font-heading text-3xl text-white sm:text-4xl">
              {project.title}
            </h1>
            <p className="mt-6 text-lg leading-8 text-white/85">
              {project.detailHeading}
            </p>
            <p className="mt-5 text-base leading-8 text-white/70">
              {project.detailBody}
            </p>
            <ul className="mt-6 space-y-4 text-sm leading-7 text-white/68 sm:text-base">
              {project.detailPoints.map((point) => (
                <li key={point} className="flex gap-3">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </main>
  );
}
