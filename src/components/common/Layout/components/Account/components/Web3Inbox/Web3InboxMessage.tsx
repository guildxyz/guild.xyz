import {
  HStack,
  Icon,
  Img,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import Link from "components/common/Link"
import { Modal } from "components/common/Modal"
import { ArrowRight } from "phosphor-react"

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
  const lightModalBgColor = useColorModeValue("white", "gray.700")
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
        py={2}
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
        <Img src={icon} alt={title} boxSize={6} borderRadius="full" />

        <Stack spacing={0} w="full">
          <HStack justifyContent="space-between">
            <Text as="span" fontWeight="bold" noOfLines={1}>
              {title}
            </Text>
            <Text as="span" colorScheme="gray" fontSize="sm">
              {prettyDate}
            </Text>
          </HStack>
          <Text noOfLines={1} colorScheme="gray">
            {body}
          </Text>
        </Stack>
      </HStack>

      <Modal isOpen={isOpen} onClose={onClose} colorScheme="dark">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bgColor={lightModalBgColor}>
            <HStack spacing={4}>
              <Img src={icon} alt={title} boxSize={12} borderRadius="full" />
              <Stack spacing={0.5}>
                <Text as="span">{title}</Text>
                <Text fontFamily="body" colorScheme="gray" fontSize="sm">
                  {prettyDate}
                </Text>
              </Stack>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody pt={8}>
            <Stack spacing={4}>
              <Text>{body}</Text>
              <Link href={url} colorScheme="blue" ml="auto">
                Visit guild
                <Icon as={ArrowRight} ml={1} />
              </Link>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default Web3InboxMessage
