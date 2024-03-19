import { SimpleGrid, Text } from "@chakra-ui/react"
import LogicDivider from "components/[guild]/LogicDivider"
import useGuild from "components/[guild]/hooks/useGuild"
import { DISPLAY_CARD_INTERACTIVITY_STYLES } from "components/common/DisplayCard"
import rewards, { PlatformAsRewardRestrictions } from "platforms/rewards"
import { useWatch } from "react-hook-form"
import { PlatformType, RoleFormType, Visibility } from "types"
import PlatformCard from "../../PlatformCard"

type Props = {
  onClose: () => void
  onSelect: (selectedRolePlatform: RoleFormType["rolePlatforms"][number]) => void
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

  const roleVisibility: Visibility = useWatch({ name: ".visibility" })

  const filteredPlatforms = guildPlatforms.filter(
    (guildPlatform) =>
      (rewards[PlatformType[guildPlatform.platformId]].asRewardRestriction ===
        PlatformAsRewardRestrictions.MULTIPLE_ROLES ||
        !alreadyUsedRolePlatforms?.includes(guildPlatform.id)) &&
      // temporary until we have Edit button for points to set amount
      guildPlatform.platformId !== PlatformType.POINTS &&
      // not added to the role yet
      !rolePlatforms.find(
        (rolePlatform: any) => rolePlatform.guildPlatformId === guildPlatform.id,
      ),
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

          const useCardProps = platformData.cardPropsHook

          const isGoogleReward = platform.platformId === PlatformType.GOOGLE
          const isForm =
            platform.platformGuildData?.mimeType ===
            "application/vnd.google-apps.form"

          return (
            <PlatformCard
              key={platform.id}
              usePlatformCardProps={useCardProps}
              guildPlatform={platform}
              colSpan={1}
              onClick={() => {
                onSelect({
                  guildPlatformId: platform.id,
                  isNew: true,
                  platformRoleId: isGoogleReward
                    ? isForm
                      ? "writer"
                      : "reader"
                    : null,
                  visibility: roleVisibility,
                })
                onClose()
              }}
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
