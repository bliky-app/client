export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(value)
}

export const formatTime = (isoString: string, timezone?: string): string => {
  if (!isoString) return ""

  const date = new Date(isoString)
  if (isNaN(date.getTime())) return ""

  return new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
  }).format(date)
}

export const formatAppointmentDate = (isoString: string, timezone?: string): string => {
  if (!isoString) return ""

  const date = new Date(isoString)
  if (isNaN(date.getTime())) return ""

  const str = new Intl.DateTimeFormat("ru-RU", {
    weekday: "short",
    day: "numeric",
    month: "long",
    timeZone: timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
  }).format(date)

  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const getTzDateString = (date: Date, timezone: string): string => {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date)
}

export const addMinutes = (isoString: string, durationMinutes: number): string => {
  const date = new Date(isoString)
  date.setMinutes(date.getMinutes() + durationMinutes)
  return date.toISOString()
}

export const formatDuration = (minutes: number): string => {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h > 0 && m > 0) return `${h} ч ${m} мин`
  if (h > 0) return `${h} ч`
  return `${m} мин`
}


export const MONTHS = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря"
]

export const getGreeting = (date: Date, timezone: string = "Europe/Moscow"): string => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    hourCycle: "h23",
    timeZone: timezone,
  })

  const hours = parseInt(formatter.format(date), 10)

  if (hours >= 5 && hours < 12) return "Доброе утро!"
  if (hours >= 12 && hours < 18) return "Добрый день!"
  if (hours >= 18 && hours < 23) return "Добрый вечер!"
  return "Доброй ночи!"
}

export const getDefaultTimezone = (): string => {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (tz) return tz
  } catch (e) {
    // ignore
  }
  return "Europe/Moscow"
}
