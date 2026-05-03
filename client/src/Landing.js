import React from "react";
import { Link } from "react-router-dom";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import {
  FiArrowRight,
  FiBarChart2,
  FiLayers,
  FiShield,
  FiTrendingUp,
  FiZap,
} from "react-icons/fi";
import Navbar from "./Navbar";

const highlights = [
  {
    title: "Price visibility",
    text: "See market swings clearly instead of chasing scattered numbers.",
    icon: FiBarChart2,
  },
  {
    title: "Inflation control",
    text: "Spot unusual jumps early and compare them across locations.",
    icon: FiTrendingUp,
  },
  {
    title: "Trust signals",
    text: "Surface clean, readable data that feels built for decision-making.",
    icon: FiShield,
  },
];

const workflow = [
  { step: "01", title: "Track the market", text: "Collect pricing from active locations and keep the view current." },
  { step: "02", title: "Compare the gap", text: "Line up prices side by side to reveal hidden inflation pressure." },
  { step: "03", title: "Act fast", text: "Use the cleaner signal to decide where to shop or flag issues." },
  { step: "04", title: "Scale the system", text: "Expand the same clear structure across the full product flow." },
];

const citySnapshot = [
  ["Dhaka", "Stable"],
  ["Chattogram", "+8%"],
  ["Rajshahi", "-3%"],
  ["Sylhet", "Watch"],
];

const metrics = [
  ["24/7", "price watch"],
  ["4-step", "decision flow"],
  ["Zero fluff", "industrial UI"],
];

const panel =
  "rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-[20px] shadow-[0_30px_120px_rgba(0,0,0,0.35)]";

const Landing = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
  };

  return (
    <div 
      className="group relative min-h-screen bg-gradient-to-br from-[#0B1A13] via-[#050D0A] to-black text-white overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-0"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(16, 185, 129, 0.12),
              transparent 80%
            )
          `,
        }}
      />

      {/* Floating Orbs for Premium Aesthetic */}
      <motion.div 
        animate={{ y: [0, -40, 0], x: [0, 30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[10%] left-[5%] h-[400px] w-[400px] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none z-0"
      />
      <motion.div 
        animate={{ y: [0, 50, 0], x: [0, -40, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[15%] right-[5%] h-[500px] w-[500px] rounded-full bg-emerald-600/10 blur-[140px] pointer-events-none z-0"
      />
      
      
      <div className="relative z-10">
        <Navbar />

        <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <motion.section 
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]"
          >
          <div className={`${panel} relative overflow-hidden p-6 sm:p-8 lg:p-10`}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.16),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.06),transparent_40%)]" />
            <div className="relative">
              <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.35em] text-slate-300">
                Organic glass clarity
              </div>

              <h1 className="mt-6 max-w-3xl text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
                Sharp pricing intelligence for everyday buyers.
              </h1>

              <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                Market Rate Price turns scattered local pricing into a glassy,
                high-contrast dashboard so shoppers can compare, question, and move
                with confidence.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-emerald-400/15 px-5 py-3 text-sm font-bold uppercase tracking-[0.25em] text-white transition hover:-translate-y-0.5 hover:bg-emerald-400/25 hover:shadow-[0_0_40px_rgba(52,211,153,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  Get started
                  <FiArrowRight />
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold uppercase tracking-[0.25em] text-white transition hover:-translate-y-0.5 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(255,255,255,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  Explore features
                  <FiArrowRight />
                </a>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                {metrics.map(([value, label]) => (
                  <div key={label} className="rounded-[28px] border border-white/10 bg-white/5 p-4">
                    <div className="text-2xl font-bold uppercase">{value}</div>
                    <div className="mt-1 text-xs font-bold uppercase tracking-[0.3em] text-slate-400">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="grid gap-4">
            <div className={`${panel} p-5`}>
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-bold uppercase tracking-[0.35em] text-slate-300">
                  Live city index
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
                  Updated hourly
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {citySnapshot.map(([city, status]) => (
                  <div key={city} className="flex items-center justify-between rounded-[20px] border border-white/10 bg-black/15 px-4 py-3">
                    <span className="text-sm font-bold uppercase">{city}</span>
                    <span className="text-xs font-bold uppercase tracking-[0.3em] text-slate-300">
                      {status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className={`${panel} border border-white/10 bg-emerald-400/15 p-5`}>
                <FiZap className="text-3xl text-emerald-200" />
                <h2 className="mt-4 text-2xl font-bold uppercase leading-tight">
                  Fast signal
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Built for quick scanning, not soft marketing fluff.
                </p>
              </div>

              <div className={`${panel} p-5`}>
                <FiLayers className="text-3xl text-slate-200" />
                <h2 className="mt-4 text-2xl font-bold uppercase leading-tight">
                  Structured layout
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Strong hierarchy makes every section feel deliberate.
                </p>
              </div>
            </div>
          </aside>
          </motion.section>

          <motion.section 
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            id="features" 
            className="scroll-mt-28 grid gap-4 md:grid-cols-3"
          >
          {highlights.map(({ title, text, icon: Icon }) => (
            <article key={title} className={`${panel} p-6`}>
              <Icon className="text-3xl text-emerald-200" />
              <h3 className="mt-5 text-2xl font-bold uppercase">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">{text}</p>
            </article>
          ))}
          </motion.section>

          <motion.section
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            id="workflow"
            className={`${panel} scroll-mt-28 p-6 text-white sm:p-8`}
          >
          <div className="flex flex-col gap-3 border-b border-white/10 pb-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.45em] text-slate-400">
                How it works
              </p>
              <h2 className="mt-2 text-3xl font-bold uppercase sm:text-4xl">
                A cleaner path from data to action.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-400">
              Every block is set up to read fast, hit hard, and keep the focus on
              pricing decisions.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {workflow.map(({ step, title, text }) => (
              <article key={step} className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                <div className="text-xs font-bold uppercase tracking-[0.45em] text-slate-400">
                  {step}
                </div>
                <h3 className="mt-4 text-xl font-bold uppercase">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{text}</p>
              </article>
            ))}
          </div>
          </motion.section>

          <motion.section 
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            id="impact" 
            className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]"
          >
          <div className={`${panel} p-6`}>
            <p className="text-[10px] font-bold uppercase tracking-[0.45em] text-slate-400">
              Why it matters
            </p>
            <h2 className="mt-3 text-3xl font-bold uppercase leading-tight">
              Less noise.
              <br />
              More decision power.
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              The landing page now matches the product promise: bold, readable, and
              built to move users toward action.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["01", "Clear hierarchy"],
              ["02", "Hard contrast"],
              ["03", "Sharp CTAs"],
            ].map(([number, label]) => (
              <div key={label} className={`${panel} p-6`}>
                <div className="text-4xl font-bold uppercase">{number}</div>
                <div className="mt-4 text-sm font-bold uppercase tracking-[0.35em] text-slate-300">
                  {label}
                </div>
              </div>
            ))}
          </div>
          </motion.section>

          <motion.section 
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            id="contact" 
            className={`${panel} scroll-mt-28 p-6 sm:p-8`}
          >
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.45em] text-slate-400">
                Ready to launch
              </p>
              <h2 className="mt-3 text-3xl font-bold uppercase sm:text-4xl">
                Build the first version with confidence.
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-emerald-400/15 px-5 py-3 text-sm font-bold uppercase tracking-[0.25em] text-white transition hover:-translate-y-0.5 hover:bg-emerald-400/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                Start now
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold uppercase tracking-[0.25em] text-white transition hover:-translate-y-0.5 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                Login
              </Link>
            </div>
          </div>
          </motion.section>
        </main>
      </div>
    </div>
  );
};

export default Landing;
