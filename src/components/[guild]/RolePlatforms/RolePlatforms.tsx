import { SimpleGrid, Text, useBreakpointValue } from "@chakra-ui/react"
import { useFieldArray, useWatch } from "react-hook-form"
import { PlatformName } from "types"
import useGuild from "../hooks/useGuild"
import DiscordCard from "./components/PlatformCard/components/DiscordCard"
import TelegramCard from "./components/PlatformCard/components/TelegramCard"
import { RolePlatformProvider } from "./components/RolePlatformProvider"

const platformCards: Record<
  Exclude<PlatformName, "">,
  ({ onRemove }: { onRemove: any }) => JSX.Element
> = {
  DISCORD: DiscordCard,
  TELEGRAM: TelegramCard,
}

const RolePlatforms = () => {
  const { platforms } = useGuild()
  const { remove } = useFieldArray({
    name: "rolePlatforms",
  })

  /**
   * Using fields like this with useWatch because the one from useFieldArray is not
   * reactive to the append triggered in the add platform button
   */
  const fields = useWatch({ name: "rolePlatforms" })

  const cols = useBreakpointValue({ base: 1, md: 2 })

  if (!fields || fields?.length <= 0)
    return <Text color={"gray.400"}>No platforms</Text>

  return (
    <SimpleGrid columns={cols} spacing={{ base: 5, md: 6 }}>
      {(fields ?? []).map((rolePlatform: any, index) => {
        const PlatformCard = platformCards[rolePlatform?.type]

        return (
          <RolePlatformProvider
            key={rolePlatform.roleId}
            rolePlatform={{
              ...rolePlatform,
              // These should be available in rolePlatform
              nativePlatformId:
                (typeof rolePlatform.platformId === "string" &&
                  rolePlatform.platformId) ||
                platforms?.[0]?.platformId,
              type: rolePlatform.type,
            }}
          >
            <PlatformCard onRemove={() => remove(index)} />
          </RolePlatformProvider>
        )
      })}
    </SimpleGrid>
  )
}

export default RolePlatforms
