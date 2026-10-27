import {
  Coordinates,
  CalculationMethod,
  PrayerTimes,
  SunnahTimes,
  Qibla,
  Prayer,
} from 'adhan'

import type { PrayerOffsets } from '../types'

export const CAIRO_COORDINATES = new Coordinates(30.0444, 31.2357)

export const PRAYER_NAMES: Record<string, { ar: string; en: string }> = {
  [Prayer.Fajr]: { ar: 'الفجر', en: 'Fajr' },
  [Prayer.Sunrise]: { ar: 'الشروق', en: 'Sunrise' },
  [Prayer.Dhuhr]: { ar: 'الظهر', en: 'Dhuhr' },
  [Prayer.Asr]: { ar: 'العصر', en: 'Asr' },
  [Prayer.Maghrib]: { ar: 'المغرب', en: 'Maghrib' },
  [Prayer.Isha]: { ar: 'العشاء', en: 'Isha' },
  [Prayer.None]: { ar: 'لا يوجد', en: 'None' },
}

export function getCairoPrayerTimes(date: Date = new Date(), offsets?: PrayerOffsets) {
  const params = CalculationMethod.Egyptian()
  if (offsets) {
    params.adjustments = {
      fajr: offsets.fajr || 0,
      sunrise: 0,
      dhuhr: offsets.dhuhr || 0,
      asr: offsets.asr || 0,
      maghrib: offsets.maghrib || 0,
      isha: offsets.isha || 0,
    }
  }
  const prayerTimes = new PrayerTimes(CAIRO_COORDINATES, date, params)
  const sunnahTimes = new SunnahTimes(prayerTimes)
  const qiblaAngle = Math.round(Qibla(CAIRO_COORDINATES))

  return {
    prayerTimes,
    sunnahTimes,
    qiblaAngle,
  }
}

export function getNextPrayerCountdown(date: Date = new Date(), offsets?: PrayerOffsets) {
  const { prayerTimes } = getCairoPrayerTimes(date, offsets)
  const next = prayerTimes.nextPrayer()
  const current = prayerTimes.currentPrayer()

  let countdown = '00:00:00'
  let nextTime: Date | null = null

  if (next && next !== Prayer.None) {
    nextTime = prayerTimes.timeForPrayer(next)
    if (nextTime) {
      const diffMs = nextTime.getTime() - date.getTime()
      if (diffMs > 0) {
        const hours = Math.floor(diffMs / (1000 * 60 * 60))
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000)
        countdown = `${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      }
    }
  } else {
    // If after Isha, next prayer is tomorrow's Fajr
    const tomorrow = new Date(date)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowTimes = getCairoPrayerTimes(tomorrow, offsets).prayerTimes
    nextTime = tomorrowTimes.fajr
    const diffMs = nextTime.getTime() - date.getTime()
    if (diffMs > 0) {
      const hours = Math.floor(diffMs / (1000 * 60 * 60))
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000)
      countdown = `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
  }

  const effectiveNext = next && next !== Prayer.None ? next : Prayer.Fajr
  const nextName = PRAYER_NAMES[effectiveNext] || { ar: 'الفجر', en: 'Fajr' }
  const currentName = PRAYER_NAMES[current] || { ar: '—', en: '—' }

  return {
    prayerTimes,
    currentPrayer: current,
    currentPrayerName: currentName,
    nextPrayer: effectiveNext,
    nextPrayerName: nextName,
    nextTime,
    countdown,
  }
}

export function formatTime(date: Date, locale: 'ar' | 'en' = 'ar'): string {
  return date.toLocaleTimeString(locale === 'ar' ? 'ar-EG' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

export function getFormattedDates(date: Date = new Date(), lang: 'ar' | 'en' = 'ar') {
  const gregorian = date.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  let hijri = ''
  try {
    hijri = new Intl.DateTimeFormat(
      lang === 'ar' ? 'ar-u-ca-islamic-umalqura' : 'en-u-ca-islamic-umalqura',
      {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }
    ).format(date)
  } catch {
    hijri = lang === 'ar' ? '1448 هـ' : '1448 AH'
  }

  return { gregorian, hijri }
}
