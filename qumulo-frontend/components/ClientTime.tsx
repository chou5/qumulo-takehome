'use client'
import { useEffect, useState } from 'react'

export default function ClientTime() {
  const [now, setNow] = useState<string>('') // renders empty on the server
  useEffect(() => {
    setNow(new Date().toLocaleString())
  }, [])
  return <span suppressHydrationWarning>{now}</span>
}
