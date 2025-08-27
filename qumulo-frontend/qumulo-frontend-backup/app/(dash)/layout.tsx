'use client'
import { usePathname } from 'next/navigation'

export default function DashLayout({ children }: { children: React.ReactNode }) {
  const p = usePathname()
  const isDash = p.startsWith('/dashboard')
  const isSnap = p.startsWith('/snapshot')

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#cbd5e1]">
      <div className="flex">
        <aside className="w-60 bg-[#0b1220] border-r border-[#1e293b]">
          <div className="p-4 font-semibold tracking-wide flex items-center gap-2">
            <span className="text-cyan-300">⬣</span>
            <span>[Cluster Name]</span>
          </div>
          <nav className="px-2 py-2 text-sm">
            <a href="/dashboard" className={`block px-3 py-2 rounded hover:bg-[#111827] ${isDash ? 'bg-[#111827]' : ''}`}>• Performance Metrics</a>
            <a href="/snapshot" className={`block px-3 py-2 rounded hover:bg-[#111827] ${isSnap ? 'bg-[#111827]' : ''}`}>• Edit Snapshot Policy</a>
          </nav>
          <div className="absolute bottom-0 p-3 text-xs opacity-80">AD\\user ▾</div>
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
