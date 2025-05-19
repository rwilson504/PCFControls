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