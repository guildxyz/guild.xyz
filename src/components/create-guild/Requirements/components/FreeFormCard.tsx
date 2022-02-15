import { Flex, Img, Text } from "@chakra-ui/react"
import { RequirementFormField } from "types"

type Props = {
  index: number
  field: RequirementFormField
}

const FreeFormCard = (_: Props): JSX.Element => (
  <Flex
    direction="column"
    alignItems="center"
    justifyContent="center"
    width="full"
    height="full"
  >
    <Img src="/guildLogos/logo.svg" boxSize={12} mb={4} />
    <Text fontFamily="display" fontWeight="bold" textAlign="center">
      Entry to your guild is free for everyone!
    </Text>
  </Flex>
)

export default FreeFormCard
