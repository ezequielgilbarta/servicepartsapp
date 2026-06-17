'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const NAV_ITEMS = [
  { href: '/ventas', label: 'Ventas' },
  { href: '/clientes', label: 'Clientes' },
  { href: '/productos', label: 'Productos' },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="min-h-screen flex">

      {/* ── Sidebar desktop ───────────────────────────────────────────── */}
      <aside className="hidden md:flex w-56 bg-white border-r border-gray-200 flex-col shrink-0">
        <div className="px-5 py-5 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">Ventix55</h1>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname.startsWith(item.href)
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* ── Mobile header ─────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0">
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 sticky top-0 z-30">
          <h1 className="text-base font-semibold text-gray-900">Ventix55</h1>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Menú"
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </header>

        {/* Mobile nav drawer */}
        {menuOpen && (
          <>
            <div
              className="md:hidden fixed inset-0 z-20 bg-black/30"
              onClick={() => setMenuOpen(false)}
            />
            <nav className="md:hidden fixed top-[53px] left-0 right-0 z-20 bg-white border-b border-gray-200 px-3 py-2 shadow-lg">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                    pathname.startsWith(item.href)
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
