"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CornerDownLeft, Search } from "lucide-react";
import { profile, projects } from "@/lib/data";
import { frames, searchProjects } from "@/lib/journey";
import { EASE } from "./ui";

type Item = {
  id: string;
  group: "Layers" | "Projects" | "Links";
  label: string;
  hint: string;
  haystack: string;
  score?: number;
  run: () => void;
};

function lexical(haystack: string, query: string) {
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return 0.1;
  const text = haystack.toLowerCase();
  const hits = tokens.filter((t) => text.includes(t)).length;
  if (hits === tokens.length) return 1;
  return hits > 0 ? 0.4 * (hits / tokens.length) : 0;
}

export default function CommandPalette({
  open,
  onClose,
  go,
  openProject,
  reduced,
}: {
  open: boolean;
  onClose: () => void;
  go: (to: number) => void;
  openProject: (slug: string) => void;
  reduced: boolean;
}) {
  return (
    <AnimatePresence>
      {open && (
        <PaletteBody
          onClose={onClose}
          go={go}
          openProject={openProject}
          reduced={reduced}
        />
      )}
    </AnimatePresence>
  );
}

function PaletteBody({
  onClose,
  go,
  openProject,
  reduced,
}: {
  onClose: () => void;
  go: (to: number) => void;
  openProject: (slug: string) => void;
  reduced: boolean;
}) {
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const items = useMemo<Item[]>(() => {
    const out: Item[] = [];
    const externals: [string, string, string][] = [
      ["Open résumé", "PDF", profile.resumeUrl],
      ["GitHub", profile.links.github, profile.links.github],
      ["LeetCode", profile.links.leetcode, profile.links.leetcode],
      ["LinkedIn", profile.links.linkedin, profile.links.linkedin],
      ["Email Harish", profile.email, `mailto:${profile.email}`],
    ];

    frames.forEach((f, i) =>
      out.push({
        id: `frame-${f.id}`,
        group: "Layers",
        label: `${String(i + 1).padStart(2, "0")} · ${f.layer}`,
        hint: f.route,
        haystack: `${f.layer} ${f.route} ${f.id}`,
        run: () => go(i),
      }),
    );

    const semantic = new Map(searchProjects(query).map((h) => [h.project.slug, h.score]));
    projects.forEach((p) =>
      out.push({
        id: `project-${p.slug}`,
        group: "Projects",
        label: p.name,
        hint: p.tagline,
        haystack: `${p.name} ${p.stack.join(" ")}`,
        score: semantic.get(p.slug),
        run: () => openProject(p.slug),
      }),
    );

    externals.forEach(([label, hint, href]) =>
      out.push({
        id: `link-${label}`,
        group: "Links",
        label,
        hint,
        haystack: `${label} ${hint}`,
        run: () => {
          if (href.startsWith("mailto:")) window.location.href = href;
          else window.open(href, "_blank", "noopener,noreferrer");
        },
      }),
    );
    return out;
  }, [query, go, openProject]);

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) {
      // Default view: layers first, then projects, then links.
      return items;
    }
    return items
      .map((it) => ({ it, s: Math.max(lexical(it.haystack, q), it.score ?? 0) }))
      .filter((r) => r.s > 0.15)
      .sort((a, b) => b.s - a.s)
      .slice(0, 9)
      .map((r) => r.it);
  }, [items, query]);

  const safeCursor = Math.min(cursor, Math.max(results.length - 1, 0));

  const run = (item: Item | undefined) => {
    if (!item) return;
    onClose();
    // let the palette unmount before navigating so focus handling stays sane
    setTimeout(item.run, 0);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor(Math.min(safeCursor + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor(Math.max(safeCursor - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(results[safeCursor]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-idx="${safeCursor}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [safeCursor]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[14vh]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0 : 0.2 }}
    >
      <button
        aria-label="Close search"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 bg-[var(--umber-deep)]/75 backdrop-blur-[3px]"
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Search the portfolio"
        initial={reduced ? false : { y: -14, scale: 0.98 }}
        animate={{ y: 0, scale: 1 }}
        transition={{ duration: reduced ? 0 : 0.3, ease: EASE }}
        onKeyDown={onKeyDown}
        className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-[var(--line-dark)] bg-[var(--umber)] text-[var(--parchment)] shadow-2xl"
      >
        <div className="flex items-center gap-3 border-b border-[var(--line-dark)] px-4 py-3.5">
          <Search size={16} className="shrink-0 text-[var(--taupe)]" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCursor(0);
            }}
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-activedescendant={results[safeCursor] ? `pal-${results[safeCursor].id}` : undefined}
            placeholder="Jump to a layer, project or link…  try “payments” or “graph”"
            className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--taupe)]/70"
          />
          <kbd className="j-kbd shrink-0">esc</kbd>
        </div>

        <ul
          id="palette-list"
          ref={listRef}
          role="listbox"
          className="max-h-[48vh] overflow-y-auto p-2"
        >
          {results.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-[var(--taupe)]">
              Nothing matches “{query}”. Try a technology or a project name.
            </li>
          )}
          {results.map((it, i) => {
            const showGroup = !query.trim() && (i === 0 || results[i - 1].group !== it.group);
            return (
              <li key={it.id} role="presentation">
                {showGroup && (
                  <p className="j-eyebrow px-3 pb-1 pt-3 text-[10px]">{it.group}</p>
                )}
                <button
                  id={`pal-${it.id}`}
                  role="option"
                  aria-selected={i === safeCursor}
                  data-idx={i}
                  onMouseMove={() => setCursor(i)}
                  onClick={() => run(it)}
                  className={`flex w-full items-center justify-between gap-4 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                    i === safeCursor ? "bg-[var(--parchment)]/10" : ""
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block truncate">{it.label}</span>
                    <span className="block truncate font-mono text-[11px] text-[var(--taupe)]">
                      {it.hint}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2 text-[var(--taupe)]">
                    {query.trim() && (
                      <span className="font-mono text-[10px] uppercase tracking-wider">
                        {it.group}
                      </span>
                    )}
                    {i === safeCursor && <CornerDownLeft size={13} />}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center justify-between border-t border-[var(--line-dark)] px-4 py-2 font-mono text-[10px] text-[var(--taupe)]">
          <span>↑↓ navigate · ↵ open</span>
          <span>/ or ⌘K / Ctrl K to toggle</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
