import React from "react";
import { FiClock, FiShield, FiSettings } from "react-icons/fi";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

const shell =
  "rounded-[40px] border border-white/10 bg-white/5 p-6 backdrop-blur-[20px] shadow-[0_30px_120px_rgba(0,0,0,0.35)]";

export default function Settings() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <main className="group relative min-h-[60vh] overflow-hidden bg-transparent p-4 text-white sm:p-6" onMouseMove={handleMouseMove}>
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-0"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(16, 185, 129, 0.15),
              transparent 80%
            )
          `,
        }}
      />
      <motion.div 
        className="relative z-10 mx-auto flex max-w-5xl flex-col gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <section className={shell}>
          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.35em] text-slate-400">
            <FiSettings className="text-emerald-300" />
            Settings
          </div>
          <h1 className="mt-4 text-4xl font-bold">Workspace controls are coming next.</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
            This route now shares the same glass shell as the rest of the app so the
            visual language stays consistent while the real settings UI is built out.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            [FiClock, "Recent activity"],
            [FiShield, "Security"],
            [FiSettings, "Preferences"],
          ].map(([Icon, label]) => (
            <div key={label} className={`${shell} p-5`}>
              <Icon className="text-2xl text-emerald-300" />
              <div className="mt-4 text-sm font-bold uppercase tracking-[0.3em] text-slate-300">
                {label}
              </div>
            </div>
          ))}
        </section>
      </motion.div>
    </main>
  );
}
