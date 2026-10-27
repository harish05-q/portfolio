import { Mail } from "lucide-react";
import { FaGithub, FaLinkedin, FaCode } from "react-icons/fa";
import { profile } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--cream-line)] mt-32">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-14 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <p className="font-display text-2xl mb-2">Let&apos;s build something worth shipping.</p>
          <p className="text-[var(--ink-soft)] text-sm max-w-md">
            Open to backend & AI engineering roles, internships, and interesting collaborations.
          </p>
        </div>
        <div className="flex flex-col gap-3 items-start md:items-end">
          <div className="flex gap-3">
            <a
              href={`mailto:${profile.email}`}
              data-cursor-hover
              aria-label="Email"
              className="w-10 h-10 rounded-full border border-[var(--cream-line)] flex items-center justify-center hover:bg-[var(--sienna)] hover:text-[var(--parchment)] hover:border-[var(--sienna)] transition-colors"
            >
              <Mail size={16} />
            </a>
            <a
              href={profile.links.github}
              target="_blank"
              rel="noreferrer"
              data-cursor-hover
              aria-label="GitHub"
              className="w-10 h-10 rounded-full border border-[var(--cream-line)] flex items-center justify-center hover:bg-[var(--sienna)] hover:text-[var(--parchment)] hover:border-[var(--sienna)] transition-colors"
            >
              <FaGithub size={16} />
            </a>
            <a
              href={profile.links.linkedin}
              target="_blank"
              rel="noreferrer"
              data-cursor-hover
              aria-label="LinkedIn"
              className="w-10 h-10 rounded-full border border-[var(--cream-line)] flex items-center justify-center hover:bg-[var(--sienna)] hover:text-[var(--parchment)] hover:border-[var(--sienna)] transition-colors"
            >
              <FaLinkedin size={16} />
            </a>
            <a
              href={profile.links.leetcode}
              target="_blank"
              rel="noreferrer"
              data-cursor-hover
              aria-label="LeetCode"
              className="w-10 h-10 rounded-full border border-[var(--cream-line)] flex items-center justify-center hover:bg-[var(--sienna)] hover:text-[var(--parchment)] hover:border-[var(--sienna)] transition-colors"
            >
              <FaCode size={16} />
            </a>
          </div>
          <p className="font-mono text-xs text-[var(--taupe)]">
            &copy; {new Date().getFullYear()} {profile.name}. Built with Next.js.
          </p>
        </div>
      </div>
    </footer>
  );
}
