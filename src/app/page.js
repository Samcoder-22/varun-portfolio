import Hero from "@/components/hero";
import ProjectsShowcase from "@/components/projects-showcase";
import { projects } from "@/data/projects";

export default function Home() {
  return (
    <main>
      <Hero />
      <ProjectsShowcase projects={projects} />
    </main>
  );
}
