import {
  CloseButton,
  SimpleGrid,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react"
import platforms from "platforms"
import { useFieldArray, useWatch } from "react-hook-form"
import { GuildPlatform, PlatformType } from "types"
import useGuild from "../hooks/useGuild"
import RemovePlatformButton from "./components/RemovePlatformButton"
import { RolePlatformProvider } from "./components/RolePlatformProvider"

type Props = {
  roleId?: number
}

const RolePlatforms = ({ roleId }: Props) => {
  const { guildPlatforms } = useGuild()
  const { remove } = useFieldArray({
    name: "rolePlatforms",
  })

  /**
   * Using fields like this with useWatch because the one from useFieldArray is not
   * reactive to the append triggered in the add platform button
   */
  const fields = useWatch({ name: "rolePlatforms" })

  const cols = useBreakpointValue({ base: 1, md: 2 })
  const removeButtonColor = useColorModeValue("gray.700", "gray.400")

  if (!fields || fields?.length <= 0)
    return <Text color={"gray.400"}>No rewards</Text>

  return (
    <SimpleGrid columns={cols} spacing={{ base: 5, md: 6 }}>
      {(fields ?? []).map((rolePlatform: any, index) => {
        let guildPlatform: GuildPlatform, type
        if (rolePlatform.guildPlatformId) {
          guildPlatform = guildPlatforms.find(
            (platform) => platform.id === rolePlatform.guildPlatformId
          )
          type = PlatformType[guildPlatform?.platformId]
        } else {
          guildPlatform = rolePlatform.guildPlatform
          type = guildPlatform.platformName
        }
        const {
          cardComponent: PlatformCard,
          cardSettingsComponent: PlatformCardSettings,
        } = platforms[type]

        return (
          <RolePlatformProvider
            key={rolePlatform.roleId}
            rolePlatform={{
              ...rolePlatform,
              roleId,
              guildPlatform,
              index,
            }}
          >
            <PlatformCard
              guildPlatform={guildPlatform}
              cornerButton={
                !rolePlatform.isNew ? (
                  <RemovePlatformButton removeButtonColor={removeButtonColor} />
                ) : (
                  <CloseButton
                    size="sm"
                    color={removeButtonColor}
                    rounded="full"
                    aria-label="Remove platform"
                    zIndex="1"
                    onClick={() => remove(index)}
                  />
                )
              }
              actionRow={PlatformCardSettings && <PlatformCardSettings />}
            />
          </RolePlatformProvider>
        )
      })}
    </SimpleGrid>
  )
}

export default RolePlatforms
