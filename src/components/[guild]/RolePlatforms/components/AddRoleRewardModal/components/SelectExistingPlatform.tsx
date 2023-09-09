import { SimpleGrid, Text, Tooltip } from "@chakra-ui/react"
import Button from "components/common/Button"
import useGuild from "components/[guild]/hooks/useGuild"
import LogicDivider from "components/[guild]/LogicDivider"
import platforms, { PlatformAsRewardRestrictions } from "platforms/platforms"
import { useFieldArray, useWatch } from "react-hook-form"
import { PlatformType, Visibility } from "types"
import PlatformCard from "../../PlatformCard"

const SelectExistingPlatform = ({ onClose }) => {
  const { guildPlatforms, roles } = useGuild()
  const alreadyUsedRolePlatforms = roles
    ?.flatMap((role) => role.rolePlatforms)
    .filter(Boolean)
    .map((rp) => rp.guildPlatformId)

  const { fields, append } = useFieldArray({
    name: "rolePlatforms",
  })

  const roleVisibility: Visibility = useWatch({ name: ".visibility" })

  const filteredPlatforms = guildPlatforms.filter(
    (guildPlatform) =>
      !fields.find(
        (rolePlatform: any) => rolePlatform.guildPlatformId === guildPlatform.id
      )
  )

  if (!filteredPlatforms.length) return null

  return (
    <>
      <Text fontWeight={"bold"} mb="3">
        Give access to existing platform
      </Text>

      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={{ base: 4, md: 6 }}>
        {filteredPlatforms?.map((platform) => {
          const useCardProps =
            platforms[PlatformType[platform.platformId]].cardPropsHook

          const isGoogleReward = platform.platformId === PlatformType.GOOGLE
          const isForm =
            platform.platformGuildData?.mimeType ===
            "application/vnd.google-apps.form"

          const isAddButtonDisabled =
            platforms[PlatformType[platform.platformId]].asRewardRestriction ===
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
                label={`You can use ${
                  platforms[PlatformType[platform.platformId]].name
                } rewards for one role only`}
                placement="bottom"
                hasArrow
              >
                <Button
                  h="10"
                  isDisabled={isAddButtonDisabled}
                  onClick={() => {
                    append({
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
