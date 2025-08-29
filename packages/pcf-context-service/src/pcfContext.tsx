
import * as React from "react";
import { PcfContextService } from './pcfContextService'
// Provides a React context for sharing the PCF context service across the component tree.

// Props for the PcfContextProvider component
interface PcfContextProviderProps {
  pcfcontext: PcfContextService;
  children: React.ReactNode;
}


// Create a React context for the PCF context service
const PcfContext = React.createContext<PcfContextService>(undefined!)

// Provider component for the PCF context service
export const PcfContextProvider = ({ pcfcontext, children }: PcfContextProviderProps) => {
  return (
    <PcfContext.Provider value={pcfcontext}>
      {children}
    </PcfContext.Provider>
  )
}


// Custom hook to access the PCF context service
export const usePcfContext = () => {
  return React.useContext(PcfContext);
}
