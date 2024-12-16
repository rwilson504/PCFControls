import { Messages } from 'react-big-calendar'

export default function GetMessages(lang: string): Messages{
    //check to see if full localized language (en-US) was sent in.
    lang = lang.indexOf('-') === -1 ? lang : lang.substring(0, lang.indexOf('-'));

    switch(lang.toLowerCase()){
        case 'fr':
            return {
                date: 'date',
                time: 'heure',
                event: 'événement',
                allDay: 'jour entier',
                week: 'semaine',
                work_week: 'semaine de travail',
                day: 'jour',
                month: 'mois',
                previous: 'précédent',
                next: 'suivant',
                yesterday: 'hier',
                tomorrow: 'demain',
                today: `aujourd'hui`,
                agenda: 'ordre du jour',              
                noEventsInRange: `Il n'y a aucun événement dans cette gamme.`,              
                showMore: total => `+${total} événement(s) supplémentaire(s)`
            }
        case 'de':
            return {
                date: 'Datum',
                time: 'Uhrzeit',
                event: 'Ereignis',
                allDay: 'ganztägig',
                week: 'Woche',
                work_week: 'Arbeitswoche',
                day: 'Tag',
                month: 'Monat',
                previous: 'Zurück',
                next: 'Weiter',
                yesterday: 'Gestern',
                tomorrow: 'Morgen',
                today: 'Heute',
                agenda: 'Agenda',              
                noEventsInRange: 'Es gibt keine Ereignisse in diesem Bereich.',              
                showMore: total => `Weitere +${total}`
            }
        case 'es':
                return {
                    date: 'Fecha',
                    time: 'Hora',
                    event: 'Evento',
                    allDay: 'Todo el dia',
                    week: 'Semana',
                    work_week: 'Semana de trabajo',
                    day: 'Día',
                    month: 'Mes',
                    previous: 'Atrás',
                    next: 'Siguiente',
                    yesterday: 'Ayer',
                    tomorrow: 'Mañana',
                    today: 'Hoy',
                    agenda: 'Calendario',              
                    noEventsInRange: 'No hay elementos programados en el intervalo de fechas.',              
                    showMore: total => `+${total} más`
                }
        case 'it':
            return {
            date: 'Data',
            time: 'Ora',
            event: 'Evento',
            allDay: 'Tutto il giorno',
            week: 'Settimana',
            work_week: 'Settimana lavorativa',
            day: 'Giorno',
            month: 'Mese',
            previous: 'Indietro',
            next: 'Avanti',
            yesterday: 'Ieri',
            tomorrow: 'Domani',
            today: 'Oggi',
            agenda: 'Calendario',
            noEventsInRange: 'Non ci sono eventi in queste date.',
            showMore: total => `+${total} altri`
            }
        case 'ru':
            return {
            date: 'Свидание',
            time: 'Время',
            event: 'Событие',
            allDay: 'Весь день',
            week: 'Неделя',
            work_week: 'Рабочая неделя',
            day: 'День',
            month: 'Месяц',
            previous: 'предыдущий',
            next: 'следующий',
            yesterday: 'Вчерашний день',
            tomorrow: 'Завтра',
            today: 'Cегодня',
            agenda: 'Повестка дня',
            noEventsInRange: 'В этом диапазоне нет событий.',
            showMore: total => `Еще +${total} события`
            }
        case 'nl':
            return {
                date: 'Datum',
                time: 'Tijdstip',
                event: 'Evenement',
                allDay: 'De hele dag',
                week: 'Week',
                work_week: 'Werk Week',
                day: 'Dag',
                month: 'Maand',
                previous: 'Terug',
                next: 'Naast',
                yesterday: 'Gisteren',
                tomorrow: 'Morgen',
                today: 'Vandaag',
                agenda: 'Agenda',              
                noEventsInRange: 'Er zijn geen evenementen gepland in deze periode.',              
                showMore: total => `+${total} meer`
            }        
        case 'en':
        default:
            return {
                date: 'Date',
                time: 'Time',
                event: 'Event',
                allDay: 'All Day',
                week: 'Week',
                work_week: 'Work Week',
                day: 'Day',
                month: 'Month',
                previous: 'Back',
                next: 'Next',
                yesterday: 'Yesterday',
                tomorrow: 'Tomorrow',
                today: 'Today',
                agenda: 'Agenda',              
                noEventsInRange: 'There are no events in this range.',              
                showMore: total => `+${total} more`
            }

    }
}