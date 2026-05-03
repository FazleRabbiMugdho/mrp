import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import logo from "./assets/MRP logo.png";

const navItems = [
  { label: "Features", href: "#features" },
  { label: "Workflow", href: "#workflow" },
  { label: "Impact", href: "#impact" },
  { label: "Contact", href: "#contact" },
];

const baseLink =
  "inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-white transition hover:-translate-y-0.5 hover:border-emerald-300/30 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(255,255,255,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 text-white backdrop-blur-[20px]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          <img src={logo} alt="MRP Logo" className="h-10 w-auto object-contain drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
          <span className="hidden text-sm font-bold uppercase tracking-[0.35em] text-slate-300 sm:block">
            Market Rate Price
          </span>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          {navItems.map(({ label, href }) => (
            <a key={label} href={href} className={baseLink}>
              {label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 sm:flex">
          <Link to="/login" className={baseLink}>
            Login
          </Link>
          <Link to="/signup" className={`${baseLink} bg-emerald-400/15`}>
            Get started
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          onClick={() => setMenuOpen((value) => !value)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            id="mobile-menu" 
            className="overflow-hidden border-t border-white/10 bg-black/60 px-4 py-4 lg:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-3">
              {navItems.map(({ label, href }) => (
                <a key={label} href={href} className={baseLink} onClick={closeMenu}>
                  {label}
                </a>
              ))}
              <Link to="/login" className={baseLink} onClick={closeMenu}>
                Login
              </Link>
              <Link to="/signup" className={`${baseLink} bg-emerald-400/15`} onClick={closeMenu}>
                Get started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
