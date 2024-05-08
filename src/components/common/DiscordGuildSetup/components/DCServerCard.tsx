import { usePrevious } from "@chakra-ui/react"
import { usePostHogContext } from "components/_app/PostHogProvider"
import Button from "components/common/Button"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import OptionCard from "components/common/OptionCard"
import usePopupWindow from "hooks/usePopupWindow"
import useServerPermissions, {
  PermissionsResponse,
} from "hooks/useServerPermissions"
import { useSetAtom } from "jotai"
import Link from "next/link"
import { ArrowSquareIn } from "phosphor-react"
import usePlatformUsageInfo from "platforms/hooks/usePlatformUsageInfo"
import { useEffect } from "react"
import { shouldShowPermissionAlertAtom } from "./PermissionAlert"

type Props = {
  serverData: {
    id: string
    name: string
    img: string
    owner: boolean
  }
  onSelect?: () => void
  onCancel?: () => void
}

function checkPermissions(permissions: PermissionsResponse["permissions"]) {
  return !!permissions?.every(
    ({ value, name }) => name === "Administrator" || !!value
  )
}

const DCServerCard = ({ serverData, onSelect, onCancel }: Props): JSX.Element => {
  const { captureEvent } = usePostHogContext()

  const {
    permissions,
    error,
    mutate,
    isLoading,
    isValidating: isPermissionsValidating,
  } = useServerPermissions(serverData.id)
  const hasAllPermissions = checkPermissions(permissions)

  const isCheckingBot = !isLoading && isPermissionsValidating
  const setShouldShowPermissionAlert = useSetAtom(shouldShowPermissionAlertAtom)

  const { onOpen: openAddBotPopup, windowInstance: activeAddBotPopup } =
    usePopupWindow(
      `https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&guild_id=${serverData.id}&permissions=268782673&scope=bot%20applications.commands`,
      undefined,
      () =>
        mutate().then((newData) => {
          const newPermissions = newData?.permissions
            ? Object.values(newData.permissions)
            : undefined

          if (!newPermissions) {
            // if the user didn't add the bot, we don't show the alert
            return
          }

          const hasMissingPermissions = !checkPermissions(newPermissions)
          setShouldShowPermissionAlert(hasMissingPermissions)
        })
    )

  const prevActiveAddBotPopup = usePrevious(activeAddBotPopup)

  useEffect(() => {
    if (!!prevActiveAddBotPopup && !activeAddBotPopup && hasAllPermissions) {
      onSelect()
    }
  }, [
    prevActiveAddBotPopup,
    activeAddBotPopup,
    hasAllPermissions,
    onSelect,
    serverData,
  ])

  useEffect(() => {
    if (hasAllPermissions && activeAddBotPopup) {
      activeAddBotPopup.close()
    }
  }, [activeAddBotPopup, hasAllPermissions])

  const { isAlreadyInUse, isUsedInCurrentGuild, guildUrlName, isValidating } =
    usePlatformUsageInfo("DISCORD", serverData.id)

  if (isUsedInCurrentGuild) return null

  return (
    <CardMotionWrapper>
      <OptionCard
        h="max-content"
        title={serverData.name}
        description={serverData.owner ? "Owner" : "Admin"}
        image={serverData.img || "/default_discord_icon.png"}
      >
        {onCancel ? (
          <Button h={10} onClick={onCancel}>
            Cancel
          </Button>
        ) : isValidating || isPermissionsValidating || isCheckingBot ? (
          <Button
            h={10}
            isLoading
            colorScheme={isCheckingBot ? "DISCORD" : undefined}
            loadingText={isCheckingBot ? "Checking Bot" : undefined}
          />
        ) : !hasAllPermissions || !!error ? (
          <Button
            h={10}
            colorScheme="DISCORD"
            onClick={() => {
              captureEvent("[discord setup] opening add bot modal")
              openAddBotPopup()
            }}
            isLoading={!!activeAddBotPopup}
            rightIcon={<ArrowSquareIn />}
          >
            Add bot
          </Button>
        ) : !isAlreadyInUse ? (
          <Button
            h={10}
            colorScheme="green"
            onClick={() => {
              captureEvent("[discord setup] selected server")
              onSelect()
            }}
            data-test="select-dc-server-button"
          >
            Select
          </Button>
        ) : isAlreadyInUse ? (
          <Button as={Link} href={`/${guildUrlName}`} h={10} colorScheme="gray">
            Go to guild
          </Button>
        ) : null}
      </OptionCard>
    </CardMotionWrapper>
  )
}

export default DCServerCard
