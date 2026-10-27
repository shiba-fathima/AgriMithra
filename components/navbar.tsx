"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Leaf } from "lucide-react"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/agrisathi", label: "AgriSathi AI" },
  { href: "/faq", label: "FAQ" },
  { href: "/team", label: "Team" },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200/50 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 shadow-sm">
            <Leaf className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-semibold tracking-tight text-slate-900">AgriMithra</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-5 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100/80 hover:text-slate-900"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex">
          <Button asChild className="bg-slate-900 hover:bg-slate-800 text-white shadow-sm rounded-full px-6 transition-all">
            <Link href="/dashboard">View Dashboard</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="rounded-full p-2 text-slate-500 hover:bg-slate-100 md:hidden transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200/50 bg-white/95 px-4 py-4 md:hidden backdrop-blur-xl">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Button asChild className="mt-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-sm">
              <Link href="/dashboard">View Dashboard</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}
