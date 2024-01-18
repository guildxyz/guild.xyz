import {
  Circle,
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
import LinkButton from "components/common/LinkButton"
import { Modal } from "components/common/Modal"
import { ArrowRight } from "phosphor-react"
import formatRelativeTimeFromNow from "utils/formatRelativeTimeFromNow"

const FALLBACK_ICON = "/requirementLogos/guild.png"

const Web3InboxMessage = ({
  publishedAt,
  title,
  icon,
  body,
  url,
}: {
  publishedAt: number
  title: string
  icon: string
  body: string
  url: string
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const hoverBgColor = useColorModeValue("blackAlpha.300", "whiteAlpha.200")
  const circleBgColor = useColorModeValue("gray.700", "gray.600")
  const isMobile = useBreakpointValue({ base: true, sm: false })

  const prettyDate = new Date(publishedAt).toLocaleDateString("en-US", {
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
        {!icon ? (
          <Img src={FALLBACK_ICON} alt={title} boxSize={10} borderRadius="full" />
        ) : icon?.startsWith("/guildLogos") ? (
          <Circle bgColor={circleBgColor} size={10}>
            <Img src={icon} alt={title} boxSize={6} />
          </Circle>
        ) : (
          <Img src={icon} alt={title} boxSize={10} borderRadius="full" />
        )}

        <Stack spacing={0} w="full">
          <HStack justifyContent="space-between">
            <Text as="span" fontWeight="bold" noOfLines={1}>
              {title}
            </Text>
            <Text as="span" colorScheme="gray" fontSize="xs">
              {formatRelativeTimeFromNow(Date.now() - publishedAt)}
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
                src={icon || FALLBACK_ICON}
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
          <ModalFooter pt="0">
            <Text fontFamily="body" colorScheme="gray" fontSize="sm">
              {prettyDate}
            </Text>
            <LinkButton
              href={url}
              variant="ghost"
              size="sm"
              ml="auto"
              rightIcon={<ArrowRight />}
            >
              Go to guild
            </LinkButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default Web3InboxMessage
