import { HStack, Text } from "@chakra-ui/react"
import Button from "components/common/Button"
import PlatformsGrid from "components/create-guild/PlatformsGrid"
import { CaretRight } from "phosphor-react"
import { useCreateGuildContext } from "./CreateGuildContext"
import CreateGuildPlatform from "./CreateGuildPlatform"

const CreateGuildIndex = (): JSX.Element => {
  const { platform, setPlatform, nextStep } = useCreateGuildContext()

  if (platform && platform !== "DEFAULT") return <CreateGuildPlatform />

  return (
    <>
      <PlatformsGrid onSelection={setPlatform} />

      <HStack w="full" justifyContent={"left"} pt={{ base: 4, md: 6 }}>
        <Text fontWeight="medium" colorScheme="gray" opacity=".7">
          or
        </Text>
        <Button
          rightIcon={<CaretRight />}
          variant="link"
          color="gray"
          fontWeight="medium"
          iconSpacing="1.5"
          onClick={() => {
            setPlatform("DEFAULT")
            nextStep()
          }}
        >
          Create guild without platform
        </Button>
      </HStack>
    </>
  )
}

export default CreateGuildIndex
