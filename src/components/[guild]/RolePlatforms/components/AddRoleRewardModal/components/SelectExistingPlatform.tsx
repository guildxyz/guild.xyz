import { SimpleGrid, Text, useDisclosure } from "@chakra-ui/react"
import { useAddRewardContext } from "components/[guild]/AddRewardContext"
import { LogicDivider } from "components/[guild]/LogicDivider"
import useGuild from "components/[guild]/hooks/useGuild"
import { DISPLAY_CARD_INTERACTIVITY_STYLES } from "components/common/DisplayCard"
import { useState } from "react"
import { useWatch } from "react-hook-form"
import rewards, { PlatformAsRewardRestrictions } from "rewards"
import { cardSettings } from "rewards/CardSettings"
import { cardPropsHooks } from "rewards/cardPropsHooks"
import {
  PlatformName,
  PlatformType,
  Requirement,
  RoleFormType,
  RolePlatform,
} from "types"
import EditRolePlatformModal from "../../EditRolePlatformModal"
import PlatformCard from "../../PlatformCard"

type Props = {
  onClose: () => void
  onSelect: (
    selectedRolePlatform: RoleFormType["rolePlatforms"][number] & {
      requirements?: Requirement[]
    }
  ) => void
}

const SelectExistingPlatform = ({ onClose, onSelect }: Props) => {
  const { guildPlatforms, roles } = useGuild()
  const alreadyUsedRolePlatforms = roles
    ?.flatMap((role) => role.rolePlatforms)
    .filter(Boolean)
    .map((rp) => rp.guildPlatformId)

  const rolePlatforms = useWatch<RoleFormType, "rolePlatforms">({
    name: "rolePlatforms",
  })

  const roleId = useWatch<RoleFormType, "id">({
    name: "id",
  })

  const roleVisibility = useWatch<RoleFormType, "visibility">({ name: "visibility" })

  const filteredPlatforms = guildPlatforms
    ? guildPlatforms.filter((guildPlatform) => {
        // If there's no platform config, just filter it out
        const platformConfig =
          rewards[PlatformType[guildPlatform.platformId] as PlatformName]
        if (!platformConfig) return false

        const canBeUsedInMultipleRoles =
          platformConfig.asRewardRestriction ===
          PlatformAsRewardRestrictions.MULTIPLE_ROLES
        const alreadyUsedInCurrentRole = roleId
          ? !!roles
              ?.find((role) => role.id === roleId)
              ?.rolePlatforms?.find((rp) => rp.guildPlatformId === guildPlatform.id)
          : false
        const alreadyUsedInAnyRole = alreadyUsedRolePlatforms?.includes(
          guildPlatform.id
        )

        return canBeUsedInMultipleRoles
          ? !alreadyUsedInCurrentRole
          : !alreadyUsedInAnyRole
      })
    : []

  const { targetRoleId } = useAddRewardContext()
  const { onOpen, onClose: settingsOnClose, isOpen } = useDisclosure()

  const [selectedRolePlatform, setSelectedRolePlatform] = useState<
    Partial<RolePlatform> | undefined
  >()

  const handleClick = (rolePlatformData?: Partial<RolePlatform>) => {
    const platformId = rolePlatformData?.guildPlatform?.platformId
    const cardSettingsComponent = cardSettings[PlatformType[platformId]] ?? null

    if (cardSettingsComponent) {
      setSelectedRolePlatform(rolePlatformData)
      onOpen()
    } else {
      onSelect(rolePlatformData)
      onClose()
    }
  }

  if (!filteredPlatforms.length) return null

  return (
    <>
      <Text fontWeight={"bold"} mb="3">
        Quick add existing reward type
      </Text>

      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={4}>
        {filteredPlatforms?.map((platform) => {
          const cardPropsHook = cardPropsHooks[PlatformType[platform.platformId]]
          if (!cardPropsHook) return null

          const isGoogleReward = platform.platformId === PlatformType.GOOGLE
          const isForm =
            platform.platformGuildData?.mimeType ===
            "application/vnd.google-apps.form"

          const isFarcasterChannelReward =
            platform.platformId === PlatformType.FARCASTER_CHANNEL

          const rolePlatformData = {
            guildPlatformId: platform.id,
            guildPlatform: platform,
            isNew: true,
            roleId: targetRoleId,
            ...(isGoogleReward && {
              platformRoleId: isForm ? "writer" : "reader",
            }),
            ...(isFarcasterChannelReward && {
              platformRoleId: `FARCASTER_CHANNEL-${targetRoleId}`,
            }),
            visibility: roleVisibility,
          }

          return (
            <>
              <PlatformCard
                key={platform.platformGuildId ?? platform.id}
                usePlatformCardProps={cardPropsHook}
                guildPlatform={platform}
                colSpan={1}
                onClick={() => {
                  handleClick(rolePlatformData)
                }}
                description={null}
                {...DISPLAY_CARD_INTERACTIVITY_STYLES}
              />
            </>
          )
        })}
      </SimpleGrid>

      {selectedRolePlatform && (
        <EditRolePlatformModal
          rolePlatform={selectedRolePlatform}
          isOpen={isOpen}
          onSubmit={(data) => {
            onSelect({ ...selectedRolePlatform, ...data })
            onClose()
          }}
          onClose={settingsOnClose}
        />
      )}

      <LogicDivider logic="OR" className="my-5 px-0" />
    </>
  )
}

export default SelectExistingPlatform
