import { addDays, getISOWeek, getYear } from 'date-fns'

export const formatNewsletterNumber = (date: Date) => {
  const weekNumber = getISOWeek(date)
  const year = getYear(date)
  return `${weekNumber}/${year}`
}

export const getCurrentNewsletterNumber = () => {
  const date = new Date()
  return formatNewsletterNumber(date)
}

export const getNextNewsletterNumber = () => {
  const date = new Date()
  const nextDate = addDays(date, 4)
  return formatNewsletterNumber(nextDate)
}
