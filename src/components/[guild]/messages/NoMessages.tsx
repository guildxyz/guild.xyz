import { Link } from "@chakra-ui/next-js"
import { HStack, Icon, Img, Stack, Text } from "@chakra-ui/react"
import { ArrowSquareOut } from "@phosphor-icons/react/ArrowSquareOut"
import Card from "components/common/Card"
import SendNewMessage from "./SendNewMessage"

const NoMessages = () => (
  <Card p={6}>
    <Stack
      direction={{ base: "column", md: "row" }}
      justifyContent="space-between"
      alignItems={{ base: "start", md: "center" }}
      spacing={6}
    >
      <HStack spacing={4} alignItems={{ base: "start", md: "center" }}>
        <Img src="/img/message.svg" boxSize="2em" />

        <Stack spacing={0.5}>
          <Text fontWeight="semibold">No messages yet</Text>
          <Text colorScheme="gray">
            You can send broadcast messages to the wallets of members with{" "}
            <Link href="https://web3inbox.com" colorScheme="blue" isExternal>
              Web3Inbox
              <Icon as={ArrowSquareOut} ml={1} />
            </Link>
          </Text>
        </Stack>
      </HStack>

      <SendNewMessage colorScheme="indigo" minW="max-content" h={10} />
    </Stack>
  </Card>
)

export default NoMessages
