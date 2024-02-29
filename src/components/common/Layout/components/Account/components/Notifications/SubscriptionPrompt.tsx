import { Center, HStack, IconButton, Img, Stack, Text } from "@chakra-ui/react"
import { ArrowRight } from "phosphor-react"

type Props = {
  onClick: () => void
}
export const SubscriptionPrompt: React.FC<Props> = ({ onClick }) => (
  <HStack pt={4} pb={5} pl={1} spacing={4}>
    <Center boxSize="6" flexShrink={0}>
      <Img src="/img/message.svg" boxSize={5} alt="Messages" mt={0.5} />
    </Center>
    <Stack spacing={0.5} w="full">
      <Text as="span" fontWeight="semibold">
        Subscribe to messages
      </Text>
      <Text as="span" fontSize="sm" colorScheme="gray" lineHeight={1.25}>
        Receive messages from guild admins
      </Text>
    </Stack>
    <IconButton
      variant="solid"
      colorScheme="blue"
      size="sm"
      onClick={onClick}
      icon={<ArrowRight />}
      aria-label="Open subscribe modal"
    />
  </HStack>
)
