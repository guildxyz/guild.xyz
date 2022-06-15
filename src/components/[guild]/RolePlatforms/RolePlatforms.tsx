import { GridItem, SimpleGrid, Text, useBreakpointValue } from "@chakra-ui/react"
import { useFieldArray, useWatch } from "react-hook-form"
import { Role } from "types"
import useGuild from "../hooks/useGuild"
import PlatformCard from "./components/PlatformCard"
import EditDiscord from "./components/PlatformCard/components/EditDiscordPlatform"
import { RolePlatformProvider } from "./components/RolePlatformProvider"

type Props = {
  role?: Role
}

const rolePlatformEdit = {
  DISCORD: EditDiscord,
}
const RolePlatforms = ({ role }: Props) => {
  const { platforms } = useGuild()
  const { remove } = useFieldArray({
    name: "rolePlatforms",
  })

  /**
   * Using fields like this with useWatch because the one from useFIeldArray is not
   * reactive to the append triggered in the add platform button
   */
  const fields = useWatch({ name: "rolePlatforms" })

  const cols = useBreakpointValue({ base: 1, md: 2 })

  if (!fields || fields?.length <= 0)
    return <Text color={"gray.400"}>No Platforms</Text>

  return (
    <SimpleGrid columns={cols} gap={10}>
      {(fields ?? []).map((rolePlatform: any, index) => {
        const isNew =
          role === undefined || // From add role drawer
          role?.platforms.every((rp) => rp.platformId !== rolePlatform.platformId)
        const EditComponent = rolePlatformEdit[rolePlatform.type]

        const card = (
          <RolePlatformProvider
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
            <PlatformCard
              key={rolePlatform.roleId}
              imageUrl={role?.imageUrl}
              name={role?.name}
              Modal={
                (isNew && EditComponent?.NewPlatform?.EditModal) ||
                EditComponent?.EditModal
              }
              onRemove={() => remove(index)}
            >
              {EditComponent &&
                ((isNew && <EditComponent.NewPlatform.Label />) || (
                  <EditComponent.Label />
                ))}
            </PlatformCard>
          </RolePlatformProvider>
        )

        if (!!EditComponent && cols > 1) {
          return <GridItem colSpan={2}>{card}</GridItem>
        }
        return card
      })}
    </SimpleGrid>
  )
}

export default RolePlatforms
