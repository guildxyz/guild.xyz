import { useCountdown } from "usehooks-ts"

export default function useCountdownDate(until: Date) {
  const [sec, controls] = useCountdown({
    countStart: Math.floor((+until - Date.now()) / 1000),
  })

  let minutes = Math.floor(sec / 60)
  let hours = Math.floor(minutes / 60)

  const days = Math.floor(hours / 24)
  hours -= days * 24
  minutes -= (days * 24 + hours) * 60
  const seconds = sec - ((days * 24 + hours) * 60 + minutes) * 60

  return [
    {
      days,
      hours,
      minutes,
      seconds,
    },
    controls,
  ] as const
}
