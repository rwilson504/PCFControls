import { useState, useEffect } from "react";
import lcid from "lcid"; // Adjust path as needed
import { SchedulerData } from "react-big-schedule";
import { SUPPORTED_LANGUAGES } from "../utils/constants";
import { IInputs } from "../generated/ManifestTypes";
import { getLocaleFromLanguage } from "../utils/formattingHelpers";
import { SchedulerAction } from "../types";

export function useSchedulerLanguage(
    pcfContext: ComponentFramework.Context<IInputs>,
    schedulerData?: SchedulerData | null,
    dispatch?: (action: SchedulerAction) => void
): string {
    const getISOLanguage: () => string = () => {
        const isCanvas = pcfContext.parameters?.isCanvas?.raw ?? false; 
        let lang = pcfContext.parameters?.schedulerLanguage?.raw || null;
        if (!lang && !isCanvas) {
            lang = lcid.from(pcfContext.userSettings.languageId) || "en";
            lang = lang.substring(0, lang.indexOf("_"));
        }
        lang = (lang || "en").toLowerCase();
        // Default to "en" if not supported
        return SUPPORTED_LANGUAGES.includes(lang) ? lang : "en";
    };

    const [schedulerLanguage, setSchedulerLanguage] = useState<string>(getISOLanguage);

    useEffect(() => {
        setSchedulerLanguage(getISOLanguage());
    }, [pcfContext.parameters.schedulerLanguage?.raw, pcfContext.userSettings.languageId]);

    // Update schedulerData locale when language changes
    useEffect(() => {
        if (schedulerData && schedulerLanguage && dispatch) {
            schedulerData.setSchedulerLocale(schedulerLanguage);
            schedulerData.setCalendarPopoverLocale(getLocaleFromLanguage(schedulerLanguage))
            dispatch({ type: "UPDATE_SCHEDULER", payload: schedulerData });
        }
    }, [schedulerLanguage]);

    return schedulerLanguage;
}