"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { profile } from "@/lib/data";

const links = [
  { href: "/", label: "Journey" },
  { href: "/classic", label: "Overview" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10"
    >
      <div className="mx-auto max-w-6xl mt-5 flex items-center justify-between rounded-full border border-[var(--cream-line)] bg-[var(--parchment)]/80 backdrop-blur-md px-5 py-3 shadow-[0_1px_0_rgba(43,36,28,0.04)]">
        <Link
          href="/"
          data-cursor-hover
          className="font-mono text-sm tracking-tight text-[var(--ink)] flex items-center gap-2"
        >
          <span className="inline-block w-2 h-2 rounded-full bg-[var(--sienna)]" />
          {profile.name}
        </Link>
        <nav className="flex items-center gap-1">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                data-cursor-hover
                className={`relative px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  active
                    ? "text-[var(--parchment)]"
                    : "text-[var(--ink-soft)] hover:text-[var(--ink)]"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-[var(--sienna)]"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{l.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </motion.header>
  );
}
