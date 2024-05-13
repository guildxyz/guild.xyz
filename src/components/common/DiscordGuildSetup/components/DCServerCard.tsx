import useGuild from "components/[guild]/hooks/useGuild"
import { usePostHogContext } from "components/_app/PostHogProvider"
import Button from "components/common/Button"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import OptionCard from "components/common/OptionCard"
import { Gateables } from "hooks/useGateables"
import useServerPermissions from "hooks/useServerPermissions"
import Link from "next/link"
import { PlatformType } from "types"

type Props = {
  serverData: Gateables[PlatformType.DISCORD][number]
  onSelect?: () => void
  onCancel?: () => void
  onSubmit?: () => void
  isLoading?: boolean
  isSelected?: boolean
}

const DCServerCard = ({
  serverData,
  onSelect: onSelectProp,
  onCancel,
  onSubmit,
  isSelected = false,
}: Props): JSX.Element => {
  const { captureEvent } = usePostHogContext()
  const { id } = useGuild() ?? {}

  const {
    mutate,
    isValidating,
    permissions: existingPermissions,
    error,
  } = useServerPermissions(serverData?.id)

  const onSelect = async () => {
    try {
      const permissions = error ? null : existingPermissions || (await mutate())

      if (!permissions) return
      if (permissions.hasAllPermissions && permissions.isRoleOrderOk) {
        onSubmit()
      }
    } finally {
      onSelectProp()
    }
  }

  const isUsedInCurrentGuild = serverData.isGuilded && serverData.guildId === id

  if (isUsedInCurrentGuild) return null

  return (
    <CardMotionWrapper>
      <OptionCard
        h="max-content"
        title={serverData.name}
        description={serverData.owner ? "Owner" : "Admin"}
        image={serverData.img || "/default_discord_icon.png"}
      >
        {isSelected ? (
          <Button h={10} onClick={onCancel}>
            Cancel
          </Button>
        ) : isValidating ? (
          <Button isLoading />
        ) : serverData.isGuilded ? (
          <Button
            as={Link}
            href={`/${serverData.guildId}`}
            h={10}
            colorScheme="gray"
          >
            Go to guild
          </Button>
        ) : (
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
        )}
      </OptionCard>
    </CardMotionWrapper>
  )
}

export default DCServerCard
