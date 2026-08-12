import { useState, useEffect, useCallback } from "react";
import { IAnnotation } from "../types";
import { usePcfContext } from "../services/PcfContext";
import { annotationService } from "../services/AnnotationService";
import { withDetail } from "../utils/errorText";
import { getTranslation, Message } from "../utils/localization";

export function useAnnotations() {
  const pcfContext = usePcfContext();
  const [annotations, setAnnotations] = useState<IAnnotation[]>([]);
  const [error, setError] = useState<string>("");

  const refreshAnnotations = useCallback(() => {
    annotationService
      .loadAnnotations(pcfContext.getEntityTypeName(), pcfContext.getEntityId())
      .then((result) => {
        let updatedAnnotations = result as IAnnotation[];
        if (!pcfContext.displayAllFiles) {
          updatedAnnotations = updatedAnnotations.map(annotation => ({
            ...annotation,
            display: false
          }));
        }
        setAnnotations(updatedAnnotations);
        return updatedAnnotations;
      })
      .catch((error: unknown) => {
        const language = pcfContext.language;
        setError(withDetail(getTranslation(Message.LoadFilesFailed, language), error, language));
      });
  }, []);

  useEffect(() => {
    refreshAnnotations();
  }, [refreshAnnotations]);

  // Watch for changes in the annotations state and update the primary property
  useEffect(() => {
    pcfContext.updatePrimaryProperty(
      annotations.length > 0 ? annotations.length.toString() : undefined
    );
  }, [annotations]);

  return { annotations, error, refreshAnnotations, setAnnotations, setError };
}
