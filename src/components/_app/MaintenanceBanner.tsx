import { Alert, AlertIcon, HStack, IconButton, Text } from "@chakra-ui/react"
import useLocalStorage from "hooks/useLocalStorage"
import { X } from "phosphor-react"

type Props = {
  maintenanceFrom: string
  maintenanceTo: string
}

const now = new Date().getTime()
const TWO_DAYS_IN_MS = 172800000 * 2
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
    <Alert status="info" borderRadius="none" py={1.5} fontSize="sm">
      <HStack w="full" justifyContent="space-between">
        <HStack spacing={1.5} alignItems="start">
          <AlertIcon position="relative" top={0.5} m={0} boxSize={4} />
          <Text as="span">
            {`Guild.xyz will be temporarily unavailable on ${maintenanceDate}
          between ${maintenanceStart} and ${maintenanceEnd} due to scheduled
          maintenance.`}
          </Text>
        </HStack>

        <IconButton
          aria-label="Close"
          variant="ghost"
          icon={<X />}
          size="xs"
          borderRadius="full"
          onClick={() => setIsBannerClosed(true)}
        />
      </HStack>
    </Alert>
  )
}

export default MaintenanceBanner
