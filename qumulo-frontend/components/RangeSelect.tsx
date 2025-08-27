'use client'
export default function RangeSelect({ value, onChange }:{
  value: '1h'|'24h'|'7d'; onChange: (v:'1h'|'24h'|'7d')=>void
}) {
  const opts: Array<{v:'1h'|'24h'|'7d'; label:string}> = [
    { v: '1h', label: 'Last 1 hour' },
    { v: '24h', label: 'Last 24 hours' },
    { v: '7d', label: 'Last 7 days' },
  ]
  return (
    <div className="relative">
      <select
        className="bg-[#0b1220] border border-[#1f2937] rounded px-3 py-2 text-sm"
        value={value}
        onChange={(e)=>onChange(e.target.value as any)}
      >
        {opts.map(o=> <option key={o.v} value={o.v}>{o.label}</option>)}
      </select>
    </div>
  )
}
