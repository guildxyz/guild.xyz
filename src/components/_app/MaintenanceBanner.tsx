import useLocalStorage from "hooks/useLocalStorage"
import InfoBanner from "./InfoBanner"

type Props = {
  maintenanceFrom: string
  maintenanceTo: string
}

const now = new Date().getTime()

const TWO_DAYS_IN_MS = 172800000
const LOCALE = "en-US"
const TO_LOCALE_STRING_OPTIONS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Budapest",
}

const MaintenanceBanner = ({
  maintenanceFrom,
  maintenanceTo,
}: Props): JSX.Element => {
  const maintenanceFromDate = new Date(maintenanceFrom)
  const maintenanceFromPrettyDate = maintenanceFromDate.toLocaleDateString(
    LOCALE,
    TO_LOCALE_STRING_OPTIONS
  )

  const [maintenanceDate, maintenanceStart] = maintenanceFromPrettyDate.split(" at ")

  const maintenanceToDate = new Date(maintenanceTo)
  const maintenanceToPrettyDate = maintenanceToDate.toLocaleDateString(
    LOCALE,
    TO_LOCALE_STRING_OPTIONS
  )

  const [, maintenanceEnd] = maintenanceToPrettyDate.split(" at ")

  const [isBannerClosed, setIsBannerClosed] = useLocalStorage(
    `${maintenanceFrom}-${maintenanceTo}-maintenance-banner-closed`,
    false
  )

  if (
    isBannerClosed ||
    now < maintenanceFromDate.getTime() - TWO_DAYS_IN_MS ||
    now > maintenanceToDate.getTime()
  )
    return null

  return (
    <InfoBanner onClose={() => setIsBannerClosed(true)}>
      {`Guild.xyz will be temporarily unavailable on ${maintenanceDate}
          between ${maintenanceStart} and ${maintenanceEnd} (CET) due to scheduled
          maintenance.`}
    </InfoBanner>
  )
}

export default MaintenanceBanner
