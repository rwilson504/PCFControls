/**
 * Formats a Date object as a string suitable for Dynamics form parameters.
 * Example output: "5/19/2025 14:30:00"
 */
export function formatDateAsParameterString(date: Date): string {
    return (
        date.getMonth() + 1
    ) + "/" +
        date.getDate() + "/" +
        date.getFullYear() + " " +
        date.getHours() + ":" +
        date.getMinutes() + ":" +
        date.getSeconds();
}

export function parseDateOnly(dateString: string): Date {
    // Expects "YYYY-MM-DD"
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day); // JS months are 0-based
}

/**
 * Converts a language code like 'en' to 'en_EN', 'es' to 'es_ES', etc.
 * If the code is empty or not recognized, defaults to 'en_EN'.
 */
export function getLocaleFromLanguage(lang: string): string {
    if (!lang) return "en_EN";
    const code = lang.toLowerCase();
    return `${code}_${code.toUpperCase()}`;
}