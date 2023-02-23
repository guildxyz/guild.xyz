import { SimpleGrid, Text } from "@chakra-ui/react"
import Button from "components/common/Button"
import useGuild from "components/[guild]/hooks/useGuild"
import LogicDivider from "components/[guild]/LogicDivider"
import platforms from "platforms"
import { useFieldArray } from "react-hook-form"
import { PlatformType } from "types"
import PlatformCard from "../../PlatformCard"

const SelectExistingPlatform = ({ onClose }) => {
  const { guildPlatforms } = useGuild()

  const { fields, append } = useFieldArray({
    name: "rolePlatforms",
  })

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

          return (
            <PlatformCard
              usePlatformProps={useCardProps}
              key={platform.id}
              guildPlatform={platform}
              colSpan={1}
            >
              <Button
                h="10"
                onClick={() => {
                  append({
                    guildPlatformId: platform.id,
                    isNew: true,
                    platformRoleData: {},
                    platformRoleId: null,
                  })
                  onClose()
                }}
              >
                Add reward
              </Button>
            </PlatformCard>
          )
        })}
      </SimpleGrid>

      <LogicDivider logic="OR" px="0" my="5" />
    </>
  )
}

export default SelectExistingPlatform
