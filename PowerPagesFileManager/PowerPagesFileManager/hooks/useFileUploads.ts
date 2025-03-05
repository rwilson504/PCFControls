import * as React from "react";
import { IAnnotation } from "../types";
import { usePcfContext } from "../services/PcfContext";
import { annotationService } from "../services/AnnotationService";

export function useFileUploads(
  setAnnotations: React.Dispatch<React.SetStateAction<IAnnotation[]>>,
  setError: (error: string) => void
) {
  const pcfcontext = usePcfContext();
  const [uploadProgress, setUploadProgress] = React.useState<Record<string, number>>({});
  const [uploadingIds, setUploadingIds] = React.useState<string[]>([]);
  const [idMapping, setIdMapping] = React.useState<Record<string, string>>({});
  
  // Keep track of AbortControllers for each upload
  const abortControllersRef = React.useRef<Record<string, AbortController>>({});
  const deletedAnnotationsRef = React.useRef<Set<string>>(new Set());

  React.useEffect(() => {
    // Clean up abort controllers on unmount
    return () => {
      Object.values(abortControllersRef.current).forEach(controller => {
        controller.abort();
      });
    };
  }, []);

  const handleFileUpload = async (file: File): Promise<void> => {
    // Check file count limits
    if (pcfcontext.maxNumberOfFiles > 0) {
      try {
        const existingAnnotations = await annotationService.loadAnnotations(pcfcontext.getEntityTypeName(), pcfcontext.getEntityId());
        const currentFileCount = existingAnnotations.length;
        if (currentFileCount + 1 > pcfcontext.maxNumberOfFiles) {
          setError(`Maximum file limit exceeded. You can upload a maximum of ${pcfcontext.maxNumberOfFiles} files. You currently have ${currentFileCount} files.`);
          return;
        }
      } catch (error) {
        setError("Error checking existing files. Please try again.");
        return;
      }
    }

    // Create temp ID and setup UI state
    const tempId = "temp_" + Date.now() + "_" + file.name;
    setAnnotations(prev => [...prev, { annotationid: tempId, filename: file.name, createdon: "Uploading..." }]);
    setUploadingIds(prev => [...prev, tempId]);
    
    // Create abort controller for this upload
    const abortController = new AbortController();
    abortControllersRef.current[tempId] = abortController;
    
    try {
      // Initialize upload and get annotation ID
      const annotationId = await annotationService.initializeUpload(
        pcfcontext.getEntityTypeName(),
        pcfcontext.getEntityId(),
        file,
        abortController.signal
      );

      // Map temp ID to real annotation ID immediately after InitializeUpload
      setIdMapping(prev => ({
        ...prev,
        [tempId]: annotationId
      }));

      // Progress handler for this upload
      const progressHandler = (percent: number) => {
        setUploadProgress(prev => ({ 
          ...prev, 
          [tempId]: percent 
        }));
      };

      // Start uploading file chunks
      await annotationService.uploadFileChunks(annotationId, file, { onProgress: progressHandler, abortSignal: abortController.signal });

      // Update UI with completed file
      setAnnotations(prev => {
        const updated = prev.filter(a => a.annotationid !== tempId);
        return [...updated, { 
          annotationid: annotationId, 
          filename: file.name, 
          createdon: new Date().toISOString() 
        }];
      });
      
      // Update tracking states
      setUploadingIds(prev => prev.filter(id => id !== tempId));
      setUploadProgress(prev => {
        const { [tempId]: _, ...rest } = prev;
        return { ...rest, [annotationId]: 100 };
      });
      
      // Clean up abort controller
      delete abortControllersRef.current[tempId];
      
    } catch (error) {
      // Handle errors during upload process
      if (abortController.signal.aborted) {
        console.log(`Upload of ${file.name} was canceled`);
      } else {
        setError(`Failed to upload file: ${file.name}`);
      }
      
      // Clean up UI state
      cleanupUploadState(tempId);
    }
  };

  // Helper to clean up UI state and delete annotations if needed
  const cleanupUploadState = (tempId: string, annotationId?: string) => {
    // Delete the annotation if we have an ID and it hasn't been deleted yet
    if (annotationId && !deletedAnnotationsRef.current.has(annotationId)) {
      deletedAnnotationsRef.current.add(annotationId);
      annotationService.deleteAnnotation(annotationId).catch((error: Error) => {
        console.log(`Failed to delete annotation ${annotationId}:`, error);
      });
    } else if (idMapping[tempId] && !deletedAnnotationsRef.current.has(idMapping[tempId])) {
      const mappedId = idMapping[tempId];
      deletedAnnotationsRef.current.add(mappedId);
      annotationService.deleteAnnotation(mappedId).catch((error: Error) => {
        console.log(`Failed to delete annotation ${mappedId}:`, error);
      });
    }
    
    // Update UI state
    setAnnotations(prev => prev.filter(a => a.annotationid !== tempId));
    setUploadingIds(prev => prev.filter(id => id !== tempId));
    setUploadProgress(prev => {
      const { [tempId]: _, ...rest } = prev;
      return rest;
    });
    
    // Clean up ID mapping
    setIdMapping(prev => {
      const { [tempId]: _, ...rest } = prev;
      return rest;
    });
    
    // Clean up abort controller
    if (abortControllersRef.current[tempId]) {
      delete abortControllersRef.current[tempId];
    }
  };

  // Cancel all ongoing uploads
  const cancelUploads = (): void => {
    const annotationsToDelete = [...uploadingIds];
    
    // Abort all ongoing uploads
    annotationsToDelete.forEach(id => {
      if (abortControllersRef.current[id]) {
        abortControllersRef.current[id].abort();
      }
      
      // Delete the annotation if it was created and not already deleted
      const annotationId = idMapping[id];
      if (annotationId && !deletedAnnotationsRef.current.has(annotationId)) {
        deletedAnnotationsRef.current.add(annotationId);
        annotationService.deleteAnnotation(annotationId).catch((error: Error) => {
          console.log(`Failed to delete annotation ${annotationId}:`, error);
        });
      }
    });
    
    // Update UI state
    setAnnotations(prev => prev.filter(a => !annotationsToDelete.includes(a.annotationid)));
    setUploadingIds([]);
    setUploadProgress({});
    setIdMapping({});
    
    // Clean up abort controllers
    annotationsToDelete.forEach(id => {
      delete abortControllersRef.current[id];
    });
  };

  return { uploadProgress, uploadingIds, handleFileUpload, cancelUploads };
}
