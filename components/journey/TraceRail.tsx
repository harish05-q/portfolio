"use client";

import { frames, totalMs, startOf, endOf } from "@/lib/journey";

/** Bottom-of-screen trace waterfall. Each span is a layer; click to jump. */
export default function TraceRail({
  index,
  go,
}: {
  index: number;
  go: (to: number) => void;
}) {
  const f = frames[index];
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-[var(--umber-deep)] via-[var(--umber-deep)]/80 to-transparent px-6 pb-5 pt-12 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-2 flex items-center justify-between gap-4 font-mono text-[11px] text-[var(--taupe)] md:text-xs">
          <p className="truncate">
            <span className="text-[var(--ochre)]">
              {String(index + 1).padStart(2, "0")}/{String(frames.length).padStart(2, "0")}
            </span>
            <span className="mx-2 opacity-40">·</span>
            <span className="uppercase tracking-[0.14em]">{f.layer}</span>
            <span className="mx-2 hidden opacity-40 sm:inline">·</span>
            <span className="hidden sm:inline">{f.route}</span>
          </p>
          <p className="shrink-0 tabular-nums">
            <span className="hidden md:inline">
              <kbd className="j-kbd">↑</kbd> <kbd className="j-kbd">↓</kbd>
              <span className="mx-2 opacity-40">·</span>
            </span>
            t+{endOf(index)}ms
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Trace waterfall: jump to a layer"
          className="pointer-events-auto relative h-6 border-b border-[var(--line-dark)]"
        >
          {frames.map((fr, i) => {
            const state = i < index ? "past" : i === index ? "now" : "future";
            return (
              <button
                key={fr.id}
                role="tab"
                aria-selected={i === index}
                aria-label={`${fr.layer} (${fr.route})`}
                title={`${fr.layer} · ${fr.route} · ${fr.dur}ms`}
                onClick={() => go(i)}
                data-cursor-hover
                className="j-focus group absolute top-0 flex h-6 items-center"
                style={{
                  left: `${(startOf(i) / totalMs) * 100}%`,
                  width: `${(fr.dur / totalMs) * 100}%`,
                }}
              >
                <span
                  className={`mx-px block h-2.5 w-full rounded-[3px] transition-all duration-300 group-hover:h-3.5 ${
                    state === "now"
                      ? "bg-[var(--sienna)] shadow-[0_0_14px_rgba(193,89,43,0.8)]"
                      : state === "past"
                        ? "bg-[var(--ochre)]/55"
                        : "bg-[var(--parchment)]/15 group-hover:bg-[var(--parchment)]/30"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
