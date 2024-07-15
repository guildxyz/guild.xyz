import {
  Divider,
  HStack,
  Icon,
  LinkBox,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  SkeletonText,
  Spinner,
  Stack,
  Table,
  Tag,
  TagLabel,
  TagLeftIcon,
  Tbody,
  Td,
  Text,
  Tooltip,
  Tr,
  Wrap,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import { Modal } from "components/common/Modal"
import { PiCheck } from "react-icons/pi"
import { PiQuestion } from "react-icons/pi"
import { PiUsers } from "react-icons/pi"
import RoleTag from "../RoleTag"
import useGuild from "../hooks/useGuild"
import { Message as MessageType } from "./hooks/useGuildMessages"
import useTargetedCount from "./hooks/useTargetedCount"

const DISPLAYED_ROLES_COUNT = 3

type Props = {
  message: MessageType
}

const Message = ({
  message: { createdAt, status, message, roleIds, receiverCount },
}: Props) => {
  const isMobile = useBreakpointValue({ base: true, md: false })
  const moreRolesTagBorderColorVar = useColorModeValue("gray-300", "whiteAlpha-300")
  const tableLeftColTextColor = useColorModeValue("gray", "whiteAlpha.600")

  const { roles } = useGuild()
  const targetedRoles = roles.filter((role) => roleIds.includes(role.id))
  const moreRolesCount = targetedRoles.length - DISPLAYED_ROLES_COUNT

  const { isOpen, onOpen, onClose } = useDisclosure()

  const outlineTagStyles = {
    variant: "outline",
    color: "var(--chakra-colors-chakra-body-text)",
    w: "max-content",
    sx: {
      "--badge-color": `var(--chakra-colors-${moreRolesTagBorderColorVar}) !important`,
    },
  }

  const { targetedCount, isTargetedCountValidating } = useTargetedCount(roleIds)

  const prettyCreatedAt = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  })

  return (
    <>
      <LinkBox
        as="button"
        textAlign="left"
        onClick={onOpen}
        borderRadius="2xl"
        _focusVisible={{
          outline: "none",
          boxShadow: "outline",
        }}
      >
        <Card p={6}>
          <Stack spacing={4} w="full">
            <Stack spacing={2} w="full">
              <Wrap>
                <Text as="span" fontWeight="bold" colorScheme="gray" fontSize="sm">
                  {prettyCreatedAt}
                </Text>
                {status === "PENDING" && (
                  <Tag colorScheme="blue" size="sm">
                    <TagLeftIcon as={Spinner} />
                    <TagLabel>Pending</TagLabel>
                  </Tag>
                )}
              </Wrap>
              <Text>{message}</Text>
            </Stack>

            <HStack justifyContent="space-between">
              <HStack spacing={1}>
                <Text as="span" colorScheme="gray" pr="0.5">
                  to:
                </Text>

                {isMobile ? (
                  <Tag {...outlineTagStyles}>
                    <TagLabel>{`${targetedRoles.length} roles`}</TagLabel>
                  </Tag>
                ) : (
                  <>
                    {targetedRoles.slice(0, DISPLAYED_ROLES_COUNT).map((role) => (
                      <RoleTag
                        key={role.id}
                        name={role.name}
                        imageUrl={role.imageUrl}
                        isHidden={role.visibility === "HIDDEN"}
                      />
                    ))}
                    {moreRolesCount > 0 && (
                      <Tag {...outlineTagStyles}>
                        <TagLabel>{`+ ${moreRolesCount} more`}</TagLabel>
                      </Tag>
                    )}
                  </>
                )}
              </HStack>

              <HStack>
                <Icon as={PiCheck} color="GrayText" />
                <Text as="span" colorScheme="gray" fontSize="sm">
                  {receiverCount}
                </Text>
                <Icon as={PiUsers} color="GrayText" />
              </HStack>
            </HStack>
          </Stack>
        </Card>
      </LinkBox>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader pb={3}>Message</ModalHeader>

          <ModalBody>
            <Stack spacing={8}>
              <Text>{message}</Text>

              <Divider />

              <Table
                variant="unstyled"
                sx={{
                  "tr td:nth-child(odd)": {
                    verticalAlign: "top",
                    pl: 0,
                    pt: 0,
                    pr: 4,
                    color: tableLeftColTextColor,
                    fontWeight: "medium",
                  },
                  "tr td:nth-child(even)": {
                    px: 0,
                    pt: 0,
                  },
                }}
                mb={-4}
              >
                <Tbody>
                  <Tr>
                    <Td>Sent on:</Td>
                    <Td>{prettyCreatedAt}</Td>
                  </Tr>
                  <Tr>
                    <Td>Targeted:</Td>
                    <Td>
                      <Wrap spacing={1}>
                        {targetedRoles.slice(0, 5).map((role) => (
                          <RoleTag
                            key={role.id}
                            name={role.name}
                            imageUrl={role.imageUrl}
                            isHidden={role.visibility === "HIDDEN"}
                          />
                        ))}
                      </Wrap>
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>Sent to:</Td>
                    <Td>
                      <HStack spacing={0.5}>
                        <b>{receiverCount}</b>
                        <Text as="span" colorScheme="gray">
                          {` (out of `}
                          {isTargetedCountValidating ? (
                            <Spinner size="xs" />
                          ) : (
                            targetedCount
                          )}
                          {` targeted)`}
                        </Text>
                        <Tooltip
                          label="You can only message users who've subscribed to the Guild.xyz app on Web3Inbox"
                          placement="top"
                          hasArrow
                        >
                          <Icon as={PiQuestion} color="GrayText" ml={1} mt={0.5} />
                        </Tooltip>
                      </HStack>
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

const MessageSkeleton = () => (
  <Card p={6}>
    <Stack spacing={4} w="full">
      <Skeleton h={4} w={36} />
      <SkeletonText noOfLines={2} skeletonHeight={4} spacing={2.5} />

      <HStack justifyContent="space-between">
        <Skeleton w="40%" h={4} />
        <Skeleton w={24} h={4} />
      </HStack>
    </Stack>
  </Card>
)

export default Message
export { MessageSkeleton }
