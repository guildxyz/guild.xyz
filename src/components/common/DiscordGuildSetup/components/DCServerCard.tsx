import { usePrevious } from "@chakra-ui/react"
import { usePostHogContext } from "components/_app/PostHogProvider"
import Button from "components/common/Button"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import OptionCard from "components/common/OptionCard"
import usePopupWindow from "hooks/usePopupWindow"
import useServerPermissions from "hooks/useServerPermissions"
import Link from "next/link"
import { ArrowSquareIn } from "phosphor-react"
import usePlatformUsageInfo from "platforms/hooks/usePlatformUsageInfo"
import { useEffect } from "react"

type Props = {
  serverData: {
    id: string
    name: string
    img: string
    owner: boolean
  }
  onSelect?: (id: string) => void
  onCancel?: () => void
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
  const canManageRoles = !!permissions?.find(({ name }) => name === "Manage Roles")
    ?.value

  const isCheckingBot = !isLoading && isPermissionsValidating

  const { onOpen: openAddBotPopup, windowInstance: activeAddBotPopup } =
    usePopupWindow(
      `https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&guild_id=${serverData.id}&permissions=268782673&scope=bot%20applications.commands`,
      undefined,
      () => mutate()
    )

  const prevActiveAddBotPopup = usePrevious(activeAddBotPopup)

  useEffect(() => {
    if (!!prevActiveAddBotPopup && !activeAddBotPopup && canManageRoles) {
      onSelect(serverData.id)
    }
  }, [
    prevActiveAddBotPopup,
    activeAddBotPopup,
    canManageRoles,
    onSelect,
    serverData.id,
  ])

  useEffect(() => {
    if (canManageRoles && activeAddBotPopup) {
      activeAddBotPopup.close()
    }
  }, [activeAddBotPopup, canManageRoles])

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
        ) : !canManageRoles || !!error ? (
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
              onSelect(serverData.id)
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
