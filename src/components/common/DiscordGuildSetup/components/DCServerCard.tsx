import useGuild from "components/[guild]/hooks/useGuild"
import Button from "components/common/Button"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import OptionCard from "components/common/OptionCard"
import { Gateables } from "hooks/useGateables"
import useServerPermissions from "hooks/useServerPermissions"
import Link from "next/link"
import { ArrowSquareOut } from "phosphor-react"
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

  const {
    mutate,
    isValidating,
    permissions: existingPermissions,
    error,
  } = useServerPermissions(serverData?.id)

  const onSelect = async () => {
    try {
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
            target="_blank"
            rightIcon={<ArrowSquareOut />}
          >
            Linked guild
          </Button>
        ) : (
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
        )}
      </OptionCard>
    </CardMotionWrapper>
  )
}

export default DCServerCard
