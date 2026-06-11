"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const sections = [
  {
    title: "Getting Started",
    links: [
      { href: "/", label: "Overview" },
      { href: "/getting-started", label: "Quick Start" },
    ],
  },
  {
    title: "Smart Contracts",
    links: [
      { href: "/contracts", label: "Overview" },
      { href: "/contracts/ilex-hook", label: "ILexHook" },
      { href: "/contracts/ilex-reactive", label: "ILexReactive" },
      { href: "/contracts/il-math", label: "ILMath" },
    ],
  },
  {
    title: "Reactive Network",
    links: [
      { href: "/reactive-network", label: "Integration" },
    ],
  },
  {
    title: "Deployment",
    links: [
      { href: "/deployment", label: "Guide" },
    ],
  },
  {
    title: "Testing",
    links: [
      { href: "/tests", label: "Test Suite" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r min-h-[calc(100vh-3.5rem)] hidden md:block">
      <nav className="p-4 space-y-6">
        {sections.map((section) => (
          <div key={section.title}>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-3">
              {section.title}
            </h3>
            <ul className="space-y-1">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={clsx(
                      "block rounded-md px-3 py-1.5 text-sm transition-colors",
                      pathname === link.href
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
