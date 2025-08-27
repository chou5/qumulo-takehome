'use client'
import { useEffect, useState } from 'react'
import ClusterSelect from '@/components/ClusterSelect'
import { getPolicy, putPolicy } from '@/lib/api'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from "react-hot-toast";

const Schema = z.object({
  enabled: z.boolean(),
  policyName: z.string().optional(),        // UI only
  directory: z.string().optional(),         // UI only
  timezone: z.string().default('America/Los_Angeles'), // UI only
  timeHH: z.string().default('07'),
  timeMM: z.string().default('00'),
  days: z.array(z.enum(['Mon','Tue','Wed','Thu','Fri','Sat','Sun'])).default(['Mon','Tue','Wed','Thu','Fri']),
  retentionMode: z.enum(['never','auto']).default('auto'),
  retentionDays: z.coerce.number().int().min(1).default(14),
  lockingEnabled: z.boolean().default(false),
  lockUntil: z.string().optional(),
})
type FormData = z.infer<typeof Schema>

// helper: build a simple cron "MM HH * * MON-FRI" or every day
function buildCron(v: FormData) {
  const mm = v.timeMM.padStart(2,'0')
  const hh = v.timeHH.padStart(2,'0')
  const map: Record<string,string> = {Sun:'SUN',Mon:'MON',Tue:'TUE',Wed:'WED',Thu:'THU',Fri:'FRI',Sat:'SAT'}
  const days = v.days.length === 7 ? '*' : v.days.map(d => map[d]).join(',')
  return `${mm} ${hh} * * ${days === '*' ? '*' : days}`
}

export default function SnapshotPage() {
  const [clusterId, setClusterId] = useState<string>()
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(Schema),
    defaultValues: { enabled:true, timeHH:'07', timeMM:'00', days:['Mon','Tue','Wed','Thu','Fri'], retentionMode:'auto', retentionDays:14 }
  })

  useEffect(() => {
    if (!clusterId) return
    getPolicy(clusterId).then(p => {
      // map API -> form
      setValue('enabled', p.enabled)
      setValue('retentionMode', 'auto')
      setValue('retentionDays', p.retentionDays)
      // naive cron parse for HH/MM and days
      const parts = (p.schedule?.cron ?? '0 7 * * MON-FRI').split(' ')
      if (parts.length >= 5) {
        setValue('timeMM', parts[0]); setValue('timeHH', parts[1])
        const days = parts[4] === '*' ? ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] :
          parts[4].split(',').map(x => x.slice(0,1)+x.slice(1,3).toLowerCase()) as any
        setValue('days', days)
      }
      setValue('lockingEnabled', !!p.locking?.enabled)
      setValue('lockUntil', p.locking?.lockUntil)
    })
  }, [clusterId, setValue])

  const onSubmit = async (formValues: SnapshotPolicyFormValues) => {
  try {
    const saved = await putPolicy(clusterId, formValues)

    // Update form fields to reflect new values
    setValue("retentionDays", saved.retentionDays)
    setValue("enabled", saved.enabled)
    setValue("schedule.cron", saved.schedule?.cron)
    setValue("locking.enabled", saved.locking?.enabled)

    toast.success("Policy saved")
  } catch (err: any) {
    console.error("PUT failed:", err)
    toast.error("Failed to save")
  }
}


  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] as const

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-white">Edit Snapshot Policy</h1>
        <ClusterSelect value={clusterId} onChange={setClusterId} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-[#0b1220] border border-[#1e293b] rounded-xl p-5 space-y-6 max-w-3xl">
        {/* Policy Name */}
        <div>
          <label className="block text-sm mb-1">Policy Name</label>
          <input {...register('policyName')} className="w-full bg-[#0b1220] border border-[#1e293b] rounded px-3 py-2" placeholder="ProjectX_Daily" />
        </div>

        {/* Directory */}
        <div>
          <label className="block text-sm mb-1">Apply to Directory</label>
          <input {...register('directory')} className="w-full bg-[#0b1220] border border-[#1e293b] rounded px-3 py-2" placeholder="/Production/ProjectX" />
        </div>

        {/* Schedule box */}
        <fieldset className="border border-[#1e293b] rounded-xl p-4">
          <legend className="px-1 text-sm opacity-80">Run Policy on the Following Schedule</legend>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm mb-1">Set to Time Zone</label>
              <input {...register('timezone')} className="w-full bg-[#0b1220] border border-[#1e293b] rounded px-3 py-2" placeholder="America/Los_Angeles" />
            </div>

            <div>
              <label className="block text-sm mb-1">Take a Snapshot at</label>
              <div className="flex gap-2">
                <input {...register('timeHH')} className="w-16 bg-[#0b1220] border border-[#1e293b] rounded px-2 py-2 text-center" />
                <input {...register('timeMM')} className="w-16 bg-[#0b1220] border border-[#1e293b] rounded px-2 py-2 text-center" />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2">On the Following Day(s)</label>
              <div className="flex flex-wrap gap-2">
                {days.map(d => (
                  <label key={d} className="inline-flex items-center gap-2 bg-[#0b1220] border border-[#1e293b] rounded px-2 py-1">
                    <input type="checkbox" value={d} {...register('days')} />
                    <span>{d}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Retention */}
          <div className="mt-4 grid sm:grid-cols-[auto,1fr] gap-3 items-center">
            <div className="text-sm">Delete Each Snapshot</div>
            <div className="flex items-center gap-4">
              <label className="inline-flex items-center gap-2">
                <input type="radio" value="never" {...register('retentionMode')} />
                Never
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="radio" value="auto" {...register('retentionMode')} />
                Automatically after
              </label>
              <input type="number" {...register('retentionDays')} className="w-20 bg-[#0b1220] border border-[#1e293b] rounded px-2 py-1" />
              <span className="text-sm opacity-70">day(s)</span>
            </div>
          </div>
        </fieldset>

        {/* Locking */}
        <fieldset className="border border-[#1e293b] rounded-xl p-4">
          <legend className="px-1 text-sm opacity-80">Snapshot Locking</legend>
          <label className="flex items-center gap-2 mb-2">
            <input type="checkbox" {...register('lockingEnabled')} />
            <span>Enable locked snapshots</span>
          </label>
          <div>
            <label className="block text-sm mb-1">Lock until (ISO)</label>
            <input {...register('lockUntil')} className="w-full bg-[#0b1220] border border-[#1e293b] rounded px-3 py-2" placeholder="2026-01-01T00:00:00Z" />
            {errors.lockUntil && <p className="text-sm text-red-400 mt-1">{errors.lockUntil.message}</p>}
          </div>
        </fieldset>

        <label className="flex items-center gap-2">
          <input type="checkbox" {...register('enabled')} />
          <span>Enable policy</span>
        </label>

        <div className="flex gap-3">
          <button className="px-4 py-2 rounded bg-[#2563eb] text-white">Save Policy</button>
          <button type="button" className="px-4 py-2 rounded border border-[#1e293b]">Cancel</button>
        </div>
      </form>
    </div>
  )
}
