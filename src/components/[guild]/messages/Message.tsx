import {
  ChakraProps,
  Divider,
  HStack,
  Icon,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Table,
  Tag,
  TagLabel,
  Tbody,
  Td,
  Text,
  Tr,
  Wrap,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import { Modal } from "components/common/Modal"
import { Checks, Users } from "phosphor-react"
import { Visibility } from "types"
import RoleTag from "../RoleTag"
import useGuild from "../hooks/useGuild"

const DISPLAYED_ROLES_COUNT = 3

const Message = () => {
  // Using this as mock data
  const { roles } = useGuild()

  const isMobile = useBreakpointValue({ base: true, md: false })
  const moreRolesTagBorderColorVar = useColorModeValue("gray-300", "whiteAlpha-300")
  const tableLeftColTextColor = useColorModeValue("black", "gray.400")

  const moreRolesCount = roles.length - DISPLAYED_ROLES_COUNT

  const { isOpen, onOpen, onClose } = useDisclosure()

  const tableLeftColStyles: ChakraProps = {
    display: "block",
    minW: "max-content",
    pl: 0,
    pt: 0,
    pr: 4,
    pb: 4,
    color: tableLeftColTextColor,
  }

  const tableRightColStyles: ChakraProps = {
    px: 0,
    pt: 0,
    pb: 4,
  }

  return (
    <>
      <Card p={6}>
        <Stack spacing={4} w="full">
          <Stack spacing={2} w="full">
            <Text as="span" fontWeight="bold" colorScheme="gray" fontSize="sm">
              2023.10.21 18:00
            </Text>
            <Text>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text ever
              since the 1500s, when an unknown printer took a galley of type and
              scrambled it to make a type specimen book. It has...
            </Text>
          </Stack>

          <HStack justifyContent="space-between">
            <HStack>
              <Text as="span" colorScheme="gray">
                to:
              </Text>

              {isMobile ? (
                <Tag
                  as="button"
                  variant="outline"
                  color="var(--chakra-colors-chakra-body-text)"
                  w="max-content"
                  sx={{
                    "--badge-color": `var(--chakra-colors-${moreRolesTagBorderColorVar}) !important`,
                  }}
                  onClick={onOpen}
                >
                  <TagLabel>{`${roles.length} roles`}</TagLabel>
                </Tag>
              ) : (
                <>
                  {roles.slice(0, DISPLAYED_ROLES_COUNT)?.map((role) => (
                    <RoleTag
                      key={role.id}
                      name={role.name}
                      imageUrl={role.imageUrl}
                      isHidden={role.visibility === Visibility.HIDDEN}
                    />
                  ))}
                  {moreRolesCount > 0 && (
                    <Tag
                      as="button"
                      variant="outline"
                      color="var(--chakra-colors-chakra-body-text)"
                      w="max-content"
                      sx={{
                        "--badge-color": `var(--chakra-colors-${moreRolesTagBorderColorVar}) !important`,
                      }}
                      onClick={onOpen}
                    >
                      <TagLabel>{`+ ${moreRolesCount} more`}</TagLabel>
                    </Tag>
                  )}
                </>
              )}
            </HStack>

            <HStack>
              <Icon as={Checks} color="gray.400" />
              <Text as="span" colorScheme="gray" fontSize="sm">
                <b>42</b>
                /56
              </Text>
              <Icon as={Users} color="gray.400" />
            </HStack>
          </HStack>
        </Stack>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader pb={3}>Message</ModalHeader>

          <ModalBody>
            <Stack spacing={8}>
              <Text>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy text
                ever since the 1500s, when an unknown printer took a galley of type
                and scrambled it to make a type specimen book. It has survived not
                only five centuries, but also the leap into electronic typesetting,
                remaining essentially unchanged. It was popularised in the 1960s with
                the release of Letraset sheets containing Lorem Ipsum passages, and
                more recently with desktop publishing software like Aldus PageMaker
                including versions of Lorem Ipsum.
              </Text>

              <Divider />

              <Table variant="unstyled">
                <Tbody>
                  <Tr>
                    <Td {...tableLeftColStyles}>Sent on</Td>
                    <Td {...tableRightColStyles}>2023.10.21 18:00</Td>
                  </Tr>
                  <Tr>
                    <Td {...tableLeftColStyles}>Sent to</Td>
                    <Td {...tableRightColStyles}>
                      <Wrap>
                        {roles?.slice(0, 5)?.map((role) => (
                          <RoleTag
                            key={role.id}
                            name={role.name}
                            imageUrl={role.imageUrl}
                            isHidden={role.visibility === Visibility.HIDDEN}
                          />
                        ))}
                      </Wrap>
                    </Td>
                  </Tr>
                  <Tr>
                    <Td {...tableLeftColStyles}>Seen by</Td>
                    <Td {...tableRightColStyles}>
                      <b>17</b> / 200 members
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

export default Message
