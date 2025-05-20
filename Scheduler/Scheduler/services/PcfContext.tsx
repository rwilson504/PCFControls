import * as React from "react";
import { PcfContextService } from './pcfContextService'

interface PcfContextProviderProps {
  pcfcontext: PcfContextService,
  children: React.ReactNode
}

const PcfContext = React.createContext<PcfContextService>(undefined!)

export const PcfContextProvider = ({ pcfcontext, children }: PcfContextProviderProps) => {
  return (
    <PcfContext.Provider value={pcfcontext}>
      {children}
    </PcfContext.Provider>
  )
}

export const usePcfContext = () => {
  return React.useContext(PcfContext)
}
