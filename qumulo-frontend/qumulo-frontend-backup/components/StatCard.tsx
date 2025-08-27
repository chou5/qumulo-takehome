export default function StatCard({ title, value, sub }:{ title:string; value:string; sub?:string }) {
  return (
    <div className="bg-[#0b1220] border border-[#1e293b] rounded-lg p-3">
      <div className="text-xs uppercase tracking-wide opacity-70">{title}</div>
      <div className="text-cyan-300 text-lg font-semibold">{value}</div>
      {sub ? <div className="text-xs opacity-60">{sub}</div> : null}
    </div>
  )
}
