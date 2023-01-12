import { Divider, Flex, HStack, Text } from "@chakra-ui/react"
import Button from "components/common/Button"
import PlatformsGrid from "components/create-guild/PlatformsGrid"
import { useRouter } from "next/router"
import { CaretRight } from "phosphor-react"
import { useCreateGuildContext } from "./CreateGuildContext"
import CreateGuildPlatform from "./CreateGuildPlatform"

const CreateGuildIndex = (): JSX.Element => {
  const router = useRouter()
  const { platform, setPlatform, nextStep } = useCreateGuildContext()

  if (platform && platform !== "DEFAULT") return <CreateGuildPlatform />

  return (
    <>
      <Text
        colorScheme="gray"
        fontSize={{ base: "sm", md: "lg" }}
        fontWeight="semibold"
      >
        You can connect more platforms later
      </Text>

      <PlatformsGrid
        onSelection={(selectedPlatform) =>
          router.replace(`/create-guild/${selectedPlatform.toLowerCase()}`)
        }
      />

      <HStack>
        <Divider />
        <Text
          as="span"
          fontWeight="bold"
          fontSize="sm"
          color="gray"
          textTransform="uppercase"
          minW="max-content"
        >
          or
        </Text>
        <Divider />
      </HStack>

      <Flex justifyContent="center">
        <Button
          rightIcon={<CaretRight />}
          variant="link"
          color="gray"
          fontWeight="normal"
          maxW="max-content"
          data-dd-action-name="Create guild without platform"
          onClick={() => {
            setPlatform("DEFAULT")
            nextStep()
          }}
        >
          Create guild without platform
        </Button>
      </Flex>
    </>
  )
}

export default CreateGuildIndex
