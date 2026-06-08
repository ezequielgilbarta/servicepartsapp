import Link from 'next/link'

const NAV_ITEMS = [
  { href: '/ventas', label: 'Ventas'},
  { href: '/clientes', label: 'Clientes'},
  { href: '/productos', label: 'Productos'},
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col">
        <div className="px-5 py-5 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">Ventix55</h1>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-md font-bold text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        {/* <div className="px-3 py-4 border-t border-gray-200">
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100 transition-colors"
            >
              Cerrar sesión
            </button>
          </form>
        </div> */}
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
