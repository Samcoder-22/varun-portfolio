export default function Hero() {
  return (
    <section className="flex min-h-dvh items-center justify-center bg-background px-6 py-12 text-center sm:px-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6">
        <h1
          className="bg-linear-[45deg,var(--color-primary)_0%,color-mix(in_srgb,var(--color-primary)_75%,transparent)_100%] bg-clip-text text-5xl font-semibold tracking-[0.18em] text-transparent sm:text-6xl md:text-7xl"
        >
          V2S LABS
        </h1>

        <p className="max-w-2xl text-base text-white/75 sm:text-lg md:text-xl">
          Robotics and AI automation projects
        </p>

        <button
          type="button"
          className="mt-2 inline-flex min-h-14 items-center justify-center rounded-full bg-primary px-8 text-base font-medium text-black transition-colors hover:bg-white sm:px-10 sm:text-lg"
        >
          Explore now
        </button>
      </div>
    </section>
  );
}
