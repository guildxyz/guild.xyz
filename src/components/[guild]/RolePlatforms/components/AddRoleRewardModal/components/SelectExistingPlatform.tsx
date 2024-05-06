import { SimpleGrid, Text } from "@chakra-ui/react"
import LogicDivider from "components/[guild]/LogicDivider"
import { openRewardSettingsGuildPlatformIdAtom } from "components/[guild]/RolePlatforms/RolePlatforms"
import useGuild from "components/[guild]/hooks/useGuild"
import { DISPLAY_CARD_INTERACTIVITY_STYLES } from "components/common/DisplayCard"
import { useSetAtom } from "jotai"
import rewards, { PlatformAsRewardRestrictions } from "platforms/rewards"
import { useWatch } from "react-hook-form"
import { PlatformType, Requirement, RoleFormType, Visibility } from "types"
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
  const setOpenGuildPlatformSettingsId = useSetAtom(
    openRewardSettingsGuildPlatformIdAtom
  )
  const { guildPlatforms, roles } = useGuild()
  const alreadyUsedRolePlatforms = roles
    ?.flatMap((role) => role.rolePlatforms)
    .filter(Boolean)
    .map((rp) => rp.guildPlatformId)

  const rolePlatforms = useWatch<RoleFormType, "rolePlatforms">({
    name: "rolePlatforms",
  })

  const roleVisibility: Visibility = useWatch({ name: ".visibility" })

  const filteredPlatforms = guildPlatforms.filter(
    (guildPlatform) =>
      (rewards[PlatformType[guildPlatform.platformId]].asRewardRestriction ===
        PlatformAsRewardRestrictions.MULTIPLE_ROLES ||
        !alreadyUsedRolePlatforms?.includes(guildPlatform.id)) &&
      // not added to the role yet
      !rolePlatforms.find(
        (rolePlatform: any) => rolePlatform.guildPlatformId === guildPlatform.id
      )
  )

  if (!filteredPlatforms.length) return null

  return (
    <>
      <Text fontWeight={"bold"} mb="3">
        Quick add existing reward type
      </Text>

      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={4}>
        {filteredPlatforms?.map((platform) => {
          const platformData = rewards[PlatformType[platform.platformId]]
          if (!platformData) return null

          const { cardPropsHook, cardSettingsComponent } = platformData

          const isGoogleReward = platform.platformId === PlatformType.GOOGLE
          const isForm =
            platform.platformGuildData?.mimeType ===
            "application/vnd.google-apps.form"

          return (
            <PlatformCard
              key={platform.id}
              usePlatformCardProps={cardPropsHook}
              guildPlatform={platform}
              colSpan={1}
              onClick={() => {
                onSelect({
                  guildPlatformId: platform.id,
                  guildPlatform: platform,
                  isNew: true,
                  platformRoleId: isGoogleReward
                    ? isForm
                      ? "writer"
                      : "reader"
                    : null,
                  visibility: roleVisibility,
                })
                if (cardSettingsComponent)
                  setOpenGuildPlatformSettingsId(platform.id)

                onClose()
              }}
              description={null}
              {...DISPLAY_CARD_INTERACTIVITY_STYLES}
            ></PlatformCard>
          )
        })}
      </SimpleGrid>

      <LogicDivider logic="OR" px="0" my="5" />
    </>
  )
}

export default SelectExistingPlatform
