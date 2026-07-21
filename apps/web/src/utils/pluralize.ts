/**
 * Склонение числительных по правилам русского языка.
 * Принимает count и три формы слова: [1, 2-4, 5+]
 * Пример: pluralize(3, ["запись", "записи", "записей"]) → "записи"
 */
export function pluralize(count: number, forms: [string, string, string]): string {
  const caseLookup = [2, 0, 1, 1, 1, 2]
  const mod100 = count % 100
  const mod10 = count % 10
  const caseIndex = mod100 > 4 && mod100 < 20 ? 2 : caseLookup[mod10 < 5 ? mod10 : 5]
  return forms[caseIndex]
}


export function pluralizeAppointment(count: number): string {
  return pluralize(count, ["запись", "записи", "записей"])
}

export function pluralizeAppointmentGenitive(count: number): string {
  return pluralize(count, ["записи", "записей", "записей"])
}

export function pluralizeWorkspace(count: number): string {
  return pluralize(count, ["пространство", "пространства", "пространств"])
}

export function pluralizeWorkspaceDative(count: number): string {
  return pluralize(count, ["пространству", "пространствам", "пространствам"])
}

export function pluralizeWorkspacePrepositional(count: number): string {
  return pluralize(count, ["пространстве", "пространствах", "пространствах"])
}

export function pluralizeUnconfirmedRequest(count: number): string {
  return pluralize(count, [
    "неподтвержденную заявку",
    "неподтвержденные заявки",
    "неподтвержденных заявок",
  ])
}

export function pluralizeMinutes(count: number): string {
  return pluralize(count, ["минута", "минуты", "минут"])
}

export function pluralizeHours(count: number): string {
  return pluralize(count, ["час", "часа", "часов"])
}
