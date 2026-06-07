"use client";

import { useEffect, useRef, useState } from "react";

import FlightScene from "@/components/flight-scene";
import Footer from "@/components/footer";
import Hero from "@/components/hero";
import ProjectsShowcase from "@/components/projects-showcase";
import { projects } from "@/data/projects";

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function animateScrollTo(targetY, duration) {
  return new Promise((resolve) => {
    const startY = window.scrollY;
    const distance = targetY - startY;
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 2);

      window.scrollTo({
        top: startY + distance * eased,
        behavior: "auto",
      });

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        resolve();
      }
    }

    window.requestAnimationFrame(step);
  });
}

export default function Home() {
  const [isExploring, setIsExploring] = useState(false);
  const [launchState, setLaunchState] = useState(null);
  const hasActiveSequence = useRef(false);

  useEffect(() => {
    let frame = 0;

    function updateBackgroundOffset() {
      const scrollRange = Math.max(document.body.scrollHeight - window.innerHeight, 1);
      const scrollProgress = Math.min(window.scrollY / scrollRange, 1);
      const yOffset = scrollProgress * 10;

      document.body.style.setProperty("--page-bg-offset-y", `${yOffset.toFixed(2)}px`);
      frame = 0;
    }

    function handleScroll() {
      if (frame !== 0) {
        return;
      }

      frame = window.requestAnimationFrame(updateBackgroundOffset);
    }

    updateBackgroundOffset();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);

      if (frame !== 0) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  async function handleExplore(event) {
    if (hasActiveSequence.current || projects.length === 0) {
      return;
    }

    hasActiveSequence.current = true;
    setIsExploring(true);
    setLaunchState((current) => ({
      token: (current?.token ?? 0) + 1,
    }));

    try {
      const firstProject = document.getElementById(projects[0].id);
      const lastProject = document.getElementById(projects[projects.length - 1].id);

      if (!firstProject || !lastProject) {
        return;
      }

      await wait(2300);
      await animateScrollTo(firstProject.offsetTop, 1200);
      await wait(2000);

      await animateScrollTo(lastProject.offsetTop, Math.max(7000, projects.length * 2600));
    } finally {
      hasActiveSequence.current = false;
      setIsExploring(false);
    }
  }

  return (
    <main className="relative">
      <div className="page-background-layer" aria-hidden="true" />
      <FlightScene launchState={launchState} isActive={isExploring} />
      <div className="relative z-10">
        <Hero onExplore={handleExplore} isExploring={isExploring} />
        <ProjectsShowcase projects={projects} />
        <Footer />
      </div>
    </main>
  );
}
