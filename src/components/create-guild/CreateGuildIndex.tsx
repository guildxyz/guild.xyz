import { Checkbox, HStack, Text } from "@chakra-ui/react"
import { useCreateGuildContext } from "./CreateGuildContext"
import CreateGuildPlatform from "./CreateGuildPlatform"
import GuildCreationProgress from "./GuildCreationProgress"
import MultiPlatformsGrid from "./MultiPlatformGrid"

const CreateGuildIndex = (): JSX.Element => {
  const { platform, setPlatform, nextStep } = useCreateGuildContext()

  if (platform && platform !== "DEFAULT") return <CreateGuildPlatform />

  return (
    <>
      <MultiPlatformsGrid
        onSelection={(platformName) => {
          setPlatform(platformName)
        }}
      />
      <HStack w="full" justifyContent={"left"} pt={{ base: 4, md: 6 }}>
        <Text fontWeight="medium" colorScheme="gray" opacity=".7">
          or
        </Text>
        <Checkbox />
        <Text
          fontWeight="medium"
          colorScheme="gray"
          opacity=".7"
          onClick={() => {
            setPlatform("DEFAULT")
          }}
        >
          continue without platform
        </Text>
      </HStack>
      <GuildCreationProgress next={nextStep} progress={20} />
    </>
  )
}

export default CreateGuildIndex
