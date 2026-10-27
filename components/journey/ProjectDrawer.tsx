"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { projects } from "@/lib/data";
import { EASE, ProjectLinks, StackChips } from "./ui";

/** Slide-over case study for any project. Esc closes; Tab stays inside. */
export default function ProjectDrawer({
  slug,
  onClose,
  reduced,
}: {
  slug: string | null;
  onClose: () => void;
  reduced: boolean;
}) {
  const project = projects.find((p) => p.slug === slug) ?? null;
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!project) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>("[data-autofocus]")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      const focusables = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      previouslyFocused?.focus?.();
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          key="drawer"
          className="fixed inset-0 z-40 flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.25 }}
        >
          <button
            aria-label="Close project details"
            tabIndex={-1}
            onClick={onClose}
            className="absolute inset-0 bg-[var(--umber-deep)]/70 backdrop-blur-[2px]"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${project.name} case study`}
            initial={reduced ? false : { x: "100%" }}
            animate={{ x: 0 }}
            exit={reduced ? { opacity: 0 } : { x: "100%" }}
            transition={{ duration: reduced ? 0 : 0.45, ease: EASE }}
            className="relative flex h-full w-full max-w-xl flex-col overflow-y-auto border-l border-[var(--line-dark)] bg-[var(--umber)] p-7 text-[var(--parchment)] shadow-2xl md:p-10"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="j-eyebrow">Case study</p>
                <h3 className="font-display mt-2 text-4xl">{project.name}</h3>
              </div>
              <button
                data-autofocus
                onClick={onClose}
                aria-label="Close"
                data-cursor-hover
                className="j-focus flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--line-dark)] transition-colors hover:bg-[var(--sienna)]"
              >
                <X size={16} />
              </button>
            </div>

            <p className="mt-5 text-lg leading-relaxed text-[var(--parchment)]/85">
              {project.tagline}
            </p>

            <p className="j-eyebrow mt-8">The problem</p>
            <p className="mt-2 leading-relaxed text-[var(--parchment)]/75">{project.problem}</p>

            <p className="j-eyebrow mt-8">What I built</p>
            <ul className="mt-3 space-y-3">
              {project.approach.map((point) => (
                <li key={point} className="flex gap-3 leading-relaxed text-[var(--parchment)]/75">
                  <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-[var(--ok)]" />
                  {point}
                </li>
              ))}
            </ul>

            <p className="j-eyebrow mt-8">Stack</p>
            <div className="mt-3">
              <StackChips items={project.stack} />
            </div>

            <div className="mt-8">
              <ProjectLinks project={project} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
