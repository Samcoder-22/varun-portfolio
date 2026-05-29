"use client";

import { useRef, useState } from "react";

import FlightScene from "@/components/flight-scene";
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
  const [launchToken, setLaunchToken] = useState(0);
  const hasActiveSequence = useRef(false);

  async function handleExplore() {
    if (hasActiveSequence.current || projects.length === 0) {
      return;
    }

    hasActiveSequence.current = true;
    setIsExploring(true);
    setLaunchToken((current) => current + 1);

    try {
      const firstProject = document.getElementById(projects[0].id);
      const lastProject = document.getElementById(projects[projects.length - 1].id);

      if (!firstProject || !lastProject) {
        return;
      }

      await animateScrollTo(firstProject.offsetTop, 1200);
      await wait(2000);

      await animateScrollTo(lastProject.offsetTop, Math.max(7000, projects.length * 2600));
    } finally {
      hasActiveSequence.current = false;
      setIsExploring(false);
    }
  }

  return (
    <main>
      <FlightScene launchToken={launchToken} isActive={isExploring} />
      <div className="relative z-10">
        <Hero onExplore={handleExplore} isExploring={isExploring} />
        <ProjectsShowcase projects={projects} />
      </div>
    </main>
  );
}
