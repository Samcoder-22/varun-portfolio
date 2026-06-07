export const projects = [
  {
    id: "swarm-ops",
    title: "Swarm Ops Console",
    brief:
      "A robotics control interface for coordinating multiple autonomous units with AI-assisted task routing and live mission state visualization.",
    detailHeading: "Mission control for autonomous fleets operating in real time.",
    detailBody:
      "Swarm Ops Console is designed for teams that need one place to supervise multiple robotic assets without losing situational clarity. The system combines live telemetry, AI-assisted prioritization, and operator controls into a unified cockpit that makes complex missions easier to manage under pressure.",
    detailPoints: [
      "Live fleet awareness with route, status, and exception monitoring across every active unit.",
      "AI-guided task routing that helps allocate robots to changing objectives with less operator overhead.",
      "Operator-first workflows for intervention, recovery, and mission replay when field conditions shift unexpectedly.",
    ],
    thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0",
    planetColor: "#1e3a8a",
    planetSize: 300,
    textureType: "rings",
  },
  {
    id: "vision-arm",
    title: "Vision Guided Assembly Arm",
    brief:
      "A computer-vision-powered manipulation pipeline for identifying parts, planning grasp points, and executing repeatable pick-and-place routines.",
    detailHeading: "Precision robotic assembly informed by perception, not fixed assumptions.",
    detailBody:
      "Vision Guided Assembly Arm brings together machine vision, spatial reasoning, and robotic motion planning to support repeatable assembly work in dynamic environments. Instead of relying on perfectly staged inputs, the system interprets part orientation, selects grasp strategies, and adapts placement behavior to maintain throughput and accuracy.",
    detailPoints: [
      "Perception models detect part geometry and pose so the arm can respond to natural variation on the line.",
      "Grasp planning balances confidence, reachability, and placement intent for reliable execution.",
      "The pipeline is built for iterative tuning, making it suitable for prototyping as well as production refinement.",
    ],
    thumbnailUrl: "https://img.youtube.com/vi/aqz-KE-bpKQ/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/aqz-KE-bpKQ?autoplay=1&rel=0",
    planetColor: "#38bdf8",
    planetSize: 260,
    textureType: "craters",
  },
  {
    id: "factory-brain",
    title: "Factory Brain Agent",
    brief:
      "An AI automation layer that connects sensors, workflows, and operator prompts to streamline repetitive industrial monitoring tasks.",
    detailHeading: "An automation layer that turns fragmented signals into useful plant intelligence.",
    detailBody:
      "Factory Brain Agent connects machine data, human prompts, and workflow triggers into a practical decision-support system for industrial teams. It is meant to reduce repetitive monitoring work, surface the right anomalies faster, and help operators move from raw signals to informed action with less friction.",
    detailPoints: [
      "Sensor streams, alerts, and operational context are brought together in one decision loop.",
      "Agentic workflows can summarize plant behavior, flag irregularities, and recommend next actions.",
      "The experience is designed to support both day-to-day visibility and longer-term process optimization.",
    ],
    thumbnailUrl: "https://img.youtube.com/vi/ysz5S6PUM-U/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/ysz5S6PUM-U?autoplay=1&rel=0",
    planetColor: "#d4c09a",
    planetSize: 320,
    textureType: "bands",
  },
];

export function getProjectById(id) {
  return projects.find((project) => project.id === id);
}
