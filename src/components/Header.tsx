"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import NavLinks from "@/components/NavLinks";

export default function Header() {
  const [open, setOpen] = useState(false);
  const controls = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !controls.current?.contains(event.target)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    const resize = () => setOpen(false);
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    window.addEventListener("resize", resize);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
      window.removeEventListener("resize", resize);
    };
  }, [open]);

  return (
    <header className="rule-b relative z-20">
      <div className="wrap flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-4">
        <Link
          href="/"
          aria-label="tape_x247 home"
          className="flex items-center gap-2.5 no-underline hover:no-underline"
        >
          <Image
            src="/logos-fonts/main%20logo.png"
            alt="tape_x247"
            width={80}
            height={80}
            priority
            className="h-20 w-20 object-contain"
          />
        </Link>
        <div className="header-controls" ref={controls} onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
        }}>
          <div className="header-desktop-nav"><NavLinks /></div>
          <button ref={toggle} type="button" className="header-menu-toggle"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open} aria-controls="header-dropdown"
            onClick={() => setOpen((value) => !value)}>
            <span aria-hidden="true" /><span aria-hidden="true" />
          </button>
          <div id="header-dropdown" className="header-dropdown" data-open={open}
            inert={!open} aria-hidden={!open}>
            <div className="header-dropdown-inner" onClick={(event) => {
              if (event.target instanceof Element && event.target.closest("a")) setOpen(false);
            }}>
              <NavLinks />
              <div className="header-theme"><span>Light theme</span><ThemeToggle /></div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
