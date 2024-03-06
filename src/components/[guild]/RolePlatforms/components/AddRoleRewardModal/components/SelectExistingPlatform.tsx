import { SimpleGrid, Text, Tooltip } from "@chakra-ui/react"
import LogicDivider from "components/[guild]/LogicDivider"
import useGuild from "components/[guild]/hooks/useGuild"
import Button from "components/common/Button"
import platforms, { PlatformAsRewardRestrictions } from "platforms/platforms"
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
      !rolePlatforms.find(
        (rolePlatform: any) => rolePlatform.guildPlatformId === guildPlatform.id
      ) && guildPlatform.platformId !== PlatformType.POINTS
  )

  if (!filteredPlatforms.length) return null

  return (
    <>
      <Text fontWeight={"bold"} mb="3">
        Give access to existing reward
      </Text>

      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={4}>
        {filteredPlatforms?.map((platform) => {
          const platformData = platforms[PlatformType[platform.platformId]]
          if (!platformData) return null

          const useCardProps = platformData.cardPropsHook

          const isGoogleReward = platform.platformId === PlatformType.GOOGLE
          const isForm =
            platform.platformGuildData?.mimeType ===
            "application/vnd.google-apps.form"

          const isAddButtonDisabled =
            platformData.asRewardRestriction ===
              PlatformAsRewardRestrictions.SINGLE_ROLE &&
            alreadyUsedRolePlatforms?.includes(platform.id)

          return (
            <PlatformCard
              key={platform.id}
              usePlatformProps={useCardProps}
              guildPlatform={platform}
              colSpan={1}
            >
              <Tooltip
                maxW="full"
                isDisabled={!isAddButtonDisabled}
                label={`You can use ${platformData.name} rewards for one role only`}
                placement="bottom"
                hasArrow
              >
                <Button
                  h="10"
                  isDisabled={isAddButtonDisabled}
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
                >
                  Add reward
                </Button>
              </Tooltip>
            </PlatformCard>
          )
        })}
      </SimpleGrid>

      <LogicDivider logic="OR" px="0" my="5" />
    </>
  )
}

export default SelectExistingPlatform
