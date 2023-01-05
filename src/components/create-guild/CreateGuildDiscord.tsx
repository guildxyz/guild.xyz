import { GridItem, SimpleGrid } from "@chakra-ui/react"
import DCServerCard from "components/common/DiscordGuildSetup/components/DCServerCard"
import ErrorAlert from "components/common/ErrorAlert"
import { OptionSkeletonCard } from "components/common/OptionCard"
import ReconnectAlert from "components/common/ReconnectAlert"
import useGateables from "hooks/useGateables"
import useIsConnected from "hooks/useIsConnected"
import usePinata from "hooks/usePinata"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { GuildFormType } from "types"
import { useCreateGuildContext } from "./CreateGuildContext"
import Pagination from "./Pagination"

// TODO: we should generalize the DiscordGuildSetup component instead of using custom logic here
const CreateGuildDiscord = (): JSX.Element => {
  const router = useRouter()
  const isConnected = useIsConnected("DISCORD")

  useEffect(() => {
    if (!isConnected) {
      router.push("/create-guild")
    }
  }, [isConnected])

  const { nextStep } = useCreateGuildContext()

  const { control, setValue } = useFormContext<GuildFormType>()

  const { gateables, isLoading, error: gateablesError } = useGateables("DISCORD")
  const servers = Object.entries(gateables || {}).map(([id, serverData]) => ({
    id,
    ...serverData,
  }))

  const selectedServer = useWatch({
    control: control,
    name: "guildPlatforms.0.platformGuildId",
  })

  const { isUploading, onUpload } = usePinata({
    // TODO: display an upload indicator somewhere
    onSuccess: ({ IpfsHash }) => {
      setValue("imageUrl", `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${IpfsHash}`)
    },
  })
  const { img, name } = servers?.find((s) => s.id === selectedServer) ?? {}

  // Todo: use the useSetImageAndNameFromPlatformData hook somehow
  useEffect(() => {
    setValue("name", name)
  }, [name])

  if (gateablesError) {
    return <ReconnectAlert platformName="DISCORD" />
  }

  if (((!servers || servers.length <= 0) && isLoading) || !isConnected) {
    return (
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 4, md: 6 }}>
        {[...Array(3)].map((i) => (
          <GridItem key={i}>
            <OptionSkeletonCard />
          </GridItem>
        ))}
      </SimpleGrid>
    )
  }

  if (servers?.length <= 0) {
    return (
      <ErrorAlert label="Seem like you're not an admin of any Discord server yet" />
    )
  }

  return (
    <>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 4, md: 6 }}>
        {servers.map((serverData) => (
          <GridItem key={serverData.id}>
            <DCServerCard
              serverData={serverData}
              onSelect={(newServerId) => {
                setValue("guildPlatforms.0.platformGuildId", newServerId)
                setTimeout(() => nextStep(), 100) // TODO: find a better solution
              }}
            />
          </GridItem>
        ))}
      </SimpleGrid>

      <Pagination nextButtonDisabled={!selectedServer} />
    </>
  )

  // TODO: move this somehow inside the SimpleLayout description
  // return (
  //   <>
  //     <Text colorScheme="gray" fontSize="lg" fontWeight="semibold" mb="10">
  //       Adding the bot and creating the Guild won't change anything on your server
  //       yet
  //     </Text>
  //   </>
  // )
}

export default CreateGuildDiscord
