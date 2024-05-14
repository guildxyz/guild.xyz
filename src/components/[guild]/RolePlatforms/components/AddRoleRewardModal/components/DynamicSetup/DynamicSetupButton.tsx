import {
  Circle,
  HStack,
  Heading,
  Icon,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import DisplayCard from "components/common/DisplayCard"
import { CaretRight, Lightning } from "phosphor-react"

const DynamicSetupButton = ({ onClick }: { onClick: () => void }) => {
  const circleBgColor = useColorModeValue("blackAlpha.200", "gray.600")

  return (
    <DisplayCard px={4} py={5} onClick={onClick}>
      <HStack spacing={3}>
        <Circle bg={circleBgColor} p={3}>
          <Icon as={Lightning} weight="fill" boxSize={5} />
        </Circle>
        <Stack gap={0}>
          <Heading size="sm" mb={0}>
            Dynamic reward amount
          </Heading>
          <Text fontWeight="normal" colorScheme="gray" mt="0">
            Calculate the reward amount based on values specific to each user's
            account, sourced from requirements set up on the role of the reward
          </Text>
        </Stack>
        <Icon ml="auto" as={CaretRight} />
      </HStack>
    </DisplayCard>
  )
}

export default DynamicSetupButton
