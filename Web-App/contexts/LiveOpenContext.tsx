"use client"

import { createContext, ReactNode, useContext } from "react"

export type LiveOpenContextValue = {
  liveOpen: boolean
}

const LiveOpenContext = createContext<LiveOpenContextValue | undefined>(undefined)

export function LiveOpenProvider({
  value,
  children,
}: {
  value: LiveOpenContextValue
  children: ReactNode
}) {
  return (
    <LiveOpenContext.Provider value={value}>
      {children}
    </LiveOpenContext.Provider>
  )
}

export function useLiveOpen() {
  const context = useContext(LiveOpenContext)
  if (!context) {
    throw new Error("useLiveOpen must be used within LiveOpenProvider")
  }
  return context
}
