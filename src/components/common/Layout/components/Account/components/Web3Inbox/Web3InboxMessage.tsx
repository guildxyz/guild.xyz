import {
  HStack,
  Img,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import Link from "next/link"
import { ArrowRight } from "phosphor-react"
import formatRelativeTimeFromNow from "utils/formatRelativeTimeFromNow"

const GUILD_NOTIFICATION_ICON = "/requirementLogos/guild.png"

const Web3InboxMessage = ({
  sentAt,
  title,
  body,
  url,
}: {
  sentAt: number
  title: string
  body: string
  url: string
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const hoverBgColor = useColorModeValue("blackAlpha.300", "whiteAlpha.200")
  const isMobile = useBreakpointValue({ base: true, sm: false })

  const prettyDate = new Date(sentAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: isMobile ? undefined : "2-digit",
    minute: isMobile ? undefined : "2-digit",
  })

  return (
    <>
      <HStack
        as="button"
        spacing={4}
        textAlign="left"
        px={4}
        pl={5}
        py={3}
        _focusVisible={{
          outline: "none",
          bgColor: hoverBgColor,
        }}
        _hover={{
          bgColor: hoverBgColor,
        }}
        transition="background 0.2s ease"
        onClick={onOpen}
      >
        <Img
          src={GUILD_NOTIFICATION_ICON}
          alt={title}
          boxSize={10}
          borderRadius="full"
        />

        <Stack spacing={0} w="full">
          <HStack justifyContent="space-between">
            <Text as="span" fontWeight="bold" noOfLines={1}>
              {title}
            </Text>
            <Text as="span" colorScheme="gray" fontSize="xs" minW="max-content">
              {formatRelativeTimeFromNow(Date.now() - sentAt)}
            </Text>
          </HStack>
          <Text noOfLines={1} colorScheme="gray">
            {body}
          </Text>
        </Stack>
      </HStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader pb="6">
            <HStack spacing={3}>
              <Img
                src={GUILD_NOTIFICATION_ICON}
                alt={title}
                boxSize={8}
                borderRadius="full"
              />
              <Text mt="-1">{title}</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Stack spacing={4}>
              <Text>{body}</Text>
            </Stack>
          </ModalBody>
          <ModalFooter pt="0" pb="8">
            <Text fontFamily="body" colorScheme="gray" fontSize="sm">
              {prettyDate}
            </Text>
            <Button
              as={Link}
              href={url}
              variant="ghost"
              colorScheme="primary"
              size="sm"
              ml="auto"
              rightIcon={<ArrowRight />}
            >
              Go to guild
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default Web3InboxMessage
