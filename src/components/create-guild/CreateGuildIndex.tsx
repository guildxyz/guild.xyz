import { Divider, Flex, HStack, Text } from "@chakra-ui/react"
import Button from "components/common/Button"
import PlatformsGrid from "components/create-guild/PlatformsGrid"
import { useRouter } from "next/router"
import { CaretRight } from "phosphor-react"
import { useCreateGuildContext } from "./CreateGuildContext"

const CreateGuildIndex = (): JSX.Element => {
  const router = useRouter()
  const { nextStep } = useCreateGuildContext()

  return (
    <>
      <PlatformsGrid
        onSelection={(selectedPlatform) =>
          router.push(`/create-guild/${selectedPlatform.toLowerCase()}`)
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

      <Flex alignItems="center">
        <Button
          rightIcon={<CaretRight />}
          mx="auto"
          maxW="max-content"
          onClick={nextStep}
        >
          Create guild without platform
        </Button>
      </Flex>
    </>
  )
}

export default CreateGuildIndex
