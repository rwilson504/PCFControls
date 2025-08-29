import * as React from "react";
import { PcfContextProvider } from "pcf-context-service";
import { PcfContextService } from "pcf-context-service";
import ImageCropControl from "./components/imageCropControl";
import { IImageCropControlProps } from "./types/imageCropTypes";

export const ImageCropApp: React.FC<IImageCropControlProps> = (props) => {
  // Create the context service.
  const pcfContextService = new PcfContextService({ 
    context: props.context, 
    instanceid: props.instanceid, 
    height: props.height 
  });

  // Wrap the SchedulerControl in providers for drag-and-drop and PCF context.
  return (    
      <PcfContextProvider pcfcontext={pcfContextService}>
        <ImageCropControl
          {...props}
        />
      </PcfContextProvider>
  );
};

export default ImageCropApp;