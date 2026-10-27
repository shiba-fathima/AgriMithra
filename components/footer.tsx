"use client"

import Link from "next/link"
import { Leaf, Mail, MapPin, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-900">
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-slate-900">
                AgriMithra
              </span>
            </Link>
            <p className="text-sm text-slate-500">
              AI + IoT powered agricultural system.
            </p>
          </div>

        </div>
      </div>
    </footer>
  )
}