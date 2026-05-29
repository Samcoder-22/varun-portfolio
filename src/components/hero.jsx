"use client";

import { motion } from "framer-motion";

const particles = [
  { size: 2, top: "12%", left: "10%", delay: "0s", duration: "6s" },
  { size: 3, top: "22%", left: "76%", delay: "1.1s", duration: "7.5s" },
  { size: 2, top: "68%", left: "18%", delay: "2.2s", duration: "6.8s" },
  { size: 4, top: "58%", left: "82%", delay: "0.7s", duration: "8.5s" },
  { size: 2, top: "38%", left: "52%", delay: "1.8s", duration: "5.8s" },
  { size: 3, top: "80%", left: "62%", delay: "2.8s", duration: "9s" },
  { size: 2, top: "30%", left: "28%", delay: "0.4s", duration: "7.2s" },
  { size: 4, top: "14%", left: "58%", delay: "2.5s", duration: "8.2s" },
  { size: 2, top: "74%", left: "88%", delay: "1.5s", duration: "6.4s" },
  { size: 3, top: "50%", left: "8%", delay: "3s", duration: "7.8s" },
];

export default function Hero({ onExplore, isExploring = false }) {
  return (
    <section className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-background px-6 py-12 text-center sm:px-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,212,0.12)_0%,rgba(0,0,0,0)_45%)]"
          initial={{ opacity: 0.3, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1.06 }}
          transition={{ duration: 2.6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        />
        {particles.map((particle, index) => (
          <motion.span
            key={index}
            className="absolute rounded-full bg-white/75 shadow-[0_0_12px_rgba(255,255,255,0.55)] animate-[spaceDrift_var(--duration)_ease-in-out_infinite]"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              top: particle.top,
              left: particle.left,
              animationDelay: particle.delay,
              "--duration": particle.duration,
            }}
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{ opacity: [0.25, 1, 0.3], scale: [0.7, 1.5, 1] }}
            transition={{
              duration: Number.parseFloat(particle.duration),
              delay: Number.parseFloat(particle.delay),
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <motion.div
        className="relative mx-auto flex w-full max-w-4xl flex-col items-center gap-6"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <motion.div
          className="hero-title-lockup"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
        >
          <span className="hero-title-capsule" aria-hidden="true" />
          <h1 className="hero-title-text font-heading bg-linear-[135deg,#d0f7ff_0%,#61d6f2_38%,#1f9fff_100%] bg-clip-text text-5xl font-black tracking-[0.18em] text-transparent sm:text-6xl md:text-8xl">
            V2S LABS
          </h1>
        </motion.div>

        <motion.p
          className="max-w-2xl mt-8 text-base font-bold tracking-wider text-white/75 sm:text-lg md:text-xl"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.28, ease: "easeOut" }}
        >
          Robotics and AI automation projects
        </motion.p>

        <motion.button
          type="button"
          onClick={onExplore}
          disabled={isExploring}
          className="mt-10 inline-flex min-h-14 cursor-pointer items-center justify-center rounded-xl bg-primary px-8 text-base font-bold tracking-wider text-black transition-colors hover:bg-white disabled:cursor-not-allowed sm:px-10 sm:text-lg"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.38, ease: "easeOut" }}
          whileHover={isExploring ? undefined : { scale: 1.03, y: -2 }}
          whileTap={isExploring ? undefined : { scale: 0.98 }}
        >
          Explore now
        </motion.button>
      </motion.div>
    </section>
  );
}
