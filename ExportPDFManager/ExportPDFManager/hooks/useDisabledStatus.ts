// import { useState, useEffect } from "react";
// import { PcfContextService } from "../services/PcfContextService";

// export const useDisabledStatus = (pcfContextService: PcfContextService) => {
//   const [isDisabled, setIsDisabled] = useState(pcfContextService.isControlDisabled());

//   useEffect(() => {
//     const interval = setInterval(() => {
//       // Poll or check for changes in the disabled state
//       const currentDisabledState = pcfContextService.isControlDisabled();
//       setIsDisabled(currentDisabledState);
//     }, 1000); // Check every second (adjust as needed)

//     return () => clearInterval(interval); // Cleanup on unmount
//   }, [pcfContextService]);

//   return isDisabled;
// };