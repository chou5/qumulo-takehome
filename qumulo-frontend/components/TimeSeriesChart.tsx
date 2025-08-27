'use client'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'

// yKey supports "single" like "iops" OR "read,write"
export default function TimeSeriesChart({ data, yKey }:{
  data: { ts:number; [k:string]: number }[]
  yKey: string
}) {
  const keys = yKey.split(',').map(s => s.trim()).filter(Boolean)
  const formatted = data.map(d => ({ ...d, time: new Date(d.ts).toLocaleDateString(undefined,{ month:'short', day:'numeric'}) + ' ' + new Date(d.ts).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) }))

  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <LineChart data={formatted}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" minTickGap={32} />
          <YAxis />
          <Tooltip />
          <Legend />
          {keys.map((k) => (
            <Line key={k} type="monotone" dataKey={k} dot={false} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
