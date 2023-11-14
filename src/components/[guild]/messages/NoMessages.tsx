import { HStack, Icon, Img, Stack, Text } from "@chakra-ui/react"
import Button from "components/common/Button"
import Card from "components/common/Card"
import Link from "components/common/Link"
import { ArrowSquareOut, Chat } from "phosphor-react"

const NoMessages = () => (
  <Card p="6">
    <Stack
      direction={{ base: "column", md: "row" }}
      justifyContent="space-between"
      alignItems={{ base: "start", md: "center" }}
      spacing="6"
    >
      <HStack spacing={4} alignItems={{ base: "start", md: "center" }}>
        <Img src="/img/message.svg" boxSize="2em" />

        <Stack spacing={0.5}>
          <Text as="span" fontWeight="semibold">
            No messages yet
          </Text>
          <Text>
            You can send broadcast messages to the wallets of members with XMTP.{" "}
            <Text as="span" colorScheme="gray">
              <Link href="https://xmtp.org" isExternal>
                Learn more
                <Icon as={ArrowSquareOut} ml={1} />
              </Link>
            </Text>
          </Text>
        </Stack>
      </HStack>
      <Button leftIcon={<Chat />} colorScheme="indigo" minW="max-content" h={10}>
        New message
      </Button>
    </Stack>
  </Card>
)

export default NoMessages
