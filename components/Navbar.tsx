import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-6 gap-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
          <span className="text-primary">◆</span>
          <span>ILex Protocol</span>
        </Link>
        <span className="text-sm text-muted-foreground hidden sm:inline">
          Documentation
        </span>
        <div className="flex-1" />
        <a
          href="https://github.com/anumukul/ILex-Protocol-UHI9"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          GitHub
        </a>
      </div>
    </header>
  );
}
