import { ArrowSquareOut } from "@phosphor-icons/react"
import useGuild from "components/[guild]/hooks/useGuild"
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
  const { id } = useGuild() ?? {}

  const isUsedInCurrentGuild = serverData.isGuilded && serverData.guildId === id

  const {
    mutate,
    isValidating,
    permissions: existingPermissions,
    error,
  } = useServerPermissions(serverData?.id, { shouldFetch: !isUsedInCurrentGuild })

  const onSelect = async () => {
    try {
      if (isUsedInCurrentGuild) {
        onSubmit()
      }

      if (error) {
        return
      }
      let permissions = existingPermissions
      if (!permissions) {
        permissions = await mutate()
      }

      if (!permissions) return
      if (permissions.hasAllPermissions && permissions.isRoleOrderOk) {
        onSubmit()
      }
    } finally {
      onSelectProp()
    }
  }

  const selectButton = (
    <Button
      h={10}
      colorScheme="green"
      onClick={() => {
        onSelect()
      }}
      data-test="select-dc-server-button"
    >
      Select
    </Button>
  )

  return (
    <CardMotionWrapper>
      <OptionCard
        h="max-content"
        title={serverData.name}
        description={serverData.owner ? "Owner" : "Admin"}
        image={serverData.img || "/default_discord_icon.png"}
      >
        {isUsedInCurrentGuild ? (
          selectButton
        ) : isSelected ? (
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
            target="_blank"
            rightIcon={<ArrowSquareOut />}
          >
            Linked guild
          </Button>
        ) : (
          selectButton
        )}
      </OptionCard>
    </CardMotionWrapper>
  )
}

export default DCServerCard
