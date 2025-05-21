// This file contains localization mappings for different views in a scheduler application.
// It provides a way to retrieve localized names for different views based on the user's language preference.


// The view names are mapped to their localized strings in different languages.
// The localization is structured as a record where the keys are language codes and the values are objects containing the localized strings.
export const VIEW_LOCALIZATION: Record<string, Record<string, string>> = {
    en: {
        view_day: "Day",
        view_week: "Week",
        view_month: "Month",
        view_quarter: "Quarter",
        view_year: "Year",
        view_work_week: "Work Week",
        view_event: "Events"
    },
    es: {
        view_day: "Día",
        view_week: "Semana",
        view_month: "Mes",
        view_quarter: "Trimestre",
        view_year: "Año",
        view_work_week: "Semana Laboral",
        view_event: "Eventos"
    },
    fr: {
        view_day: "Jour",
        view_week: "Semaine",
        view_month: "Mois",
        view_quarter: "Trimestre",
        view_year: "Année",
        view_work_week: "Semaine de travail",
        view_event: "Événements"
    },
    de: {
        view_day: "Tag",
        view_week: "Woche",
        view_month: "Monat",
        view_quarter: "Quartal",
        view_year: "Jahr",
        view_work_week: "Arbeitswoche",
        view_event: "Ereignisse"
    },
    pt: {
        view_day: "Dia",
        view_week: "Semana",
        view_month: "Mês",
        view_quarter: "Trimestre",
        view_year: "Ano",
        view_work_week: "Semana de trabalho",
        view_event: "Eventos"
    }
};

// Function to get the localized view name based on the language and key
// This function takes a language code and a key (like "view_day") and returns the localized name.
export function getLocalizedViewName(lang: string, key: string): string {
    const locale = lang.toLowerCase();
    return VIEW_LOCALIZATION[locale]?.[key] || VIEW_LOCALIZATION["en"][key] || key;
}

// Simple localization mapping for "Resource Name"
export const RESOURCE_NAME_LOCALIZATION: Record<string, string> = {
    en: "Resource Name",
    es: "Nombre del recurso",
    fr: "Nom de la ressource",
    de: "Ressourcenname",
    pt: "Nome do recurso"
};

// Function to get the localized resource name based on the language
export function getLocalizedResourceName(lang: string): string {
    return RESOURCE_NAME_LOCALIZATION[lang] || RESOURCE_NAME_LOCALIZATION["en"];
}
