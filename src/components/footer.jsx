import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-black/65 px-6 py-12 backdrop-blur-sm sm:px-8 lg:px-12">
      <div className="mx-auto grid w-full max-w-7xl gap-10 text-center md:grid-cols-3 md:text-left">
        <div className="flex flex-col items-center gap-4 md:items-start">
          <Image
            src="/vercel.svg"
            alt="V2S Labs logo placeholder"
            width={120}
            height={26}
            className="h-auto w-28"
          />
          <p className="font-heading text-lg tracking-[0.18em] text-white">V2S Labs</p>
        </div>

        <div className="flex flex-col items-center justify-center gap-3">
          <h2 className="font-heading text-2xl text-white">About Us</h2>
          <p className="max-w-sm text-sm leading-7 text-white/70">
            V2S Labs builds robotics and AI systems focused on intelligent automation,
            perception-driven control, and practical industrial workflows.
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 md:items-end">
          <h2 className="font-heading text-2xl text-white">Get in touch</h2>
          <a
            href="mailto:sample@email.com"
            className="inline-flex items-center gap-3 text-white/80 transition hover:text-white"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current text-primary">
              <path d="M3 5.75A2.75 2.75 0 0 1 5.75 3h12.5A2.75 2.75 0 0 1 21 5.75v12.5A2.75 2.75 0 0 1 18.25 21H5.75A2.75 2.75 0 0 1 3 18.25V5.75Zm2.2-.25 6.8 5.47 6.8-5.47H5.2Zm14.3 1.62-6.87 5.53a1 1 0 0 1-1.26 0L4.5 7.12v11.13c0 .69.56 1.25 1.25 1.25h12.5c.69 0 1.25-.56 1.25-1.25V7.12Z" />
            </svg>
            <span>sample@email.com</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
