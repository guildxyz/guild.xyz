import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  ButtonGroup,
  Flex,
  Icon,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
  useClipboard,
  useDisclosure,
} from "@chakra-ui/react"
import { Check, Copy, DownloadSimple, Export } from "@phosphor-icons/react"
import RoleSelector from "components/[guild]/RoleSelector"
import useGuild from "components/[guild]/hooks/useGuild"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import useSWRWithOptionalAuth from "hooks/useSWRWithOptionalAuth"
import { useRef } from "react"

const MembersExporter = (): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { id, roles } = useGuild()
  const { data, isValidating } = useSWRWithOptionalAuth(
    isOpen ? `/v2/guilds/${id}/members` : null
  )

  const downloadAnchorRef = useRef(null)

  const { hasCopied, value, setValue, onCopy } = useClipboard("")
  const csvContent = encodeURI("data:text/csv;charset=utf-8," + value)

  const onChange = (selectedRoles) => {
    if (!selectedRoles || !data) return

    setValue(
      [
        ...new Set(
          data
            ?.filter((role) => selectedRoles.includes(role.roleId.toString()))
            ?.flatMap((role) => role.members)
            ?.filter((member) => !!member) ?? []
        ),
      ].join("\n")
    )
  }

  const exportMembersAsCsv = () => {
    if (!downloadAnchorRef.current) return
    downloadAnchorRef.current.click()
  }

  const handleClose = () => {
    onClose()
    setValue("")
  }

  return (
    <>
      <Button
        aria-label="Export members"
        leftIcon={<Icon as={Export} />}
        size="sm"
        onClick={onOpen}
      >
        Export members
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        colorScheme="dark"
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader pb="7">Select roles to export members of</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isValidating ? (
              <Flex justifyContent="center" py={2} w="full">
                <Spinner />
              </Flex>
            ) : !data ? (
              <Alert status="error">
                <AlertIcon />
                <Stack>
                  <AlertTitle>Couldn't fetch members</AlertTitle>
                  <AlertDescription>
                    Please try again later and contact us on Discord if it still
                    doesn't work
                  </AlertDescription>
                </Stack>
              </Alert>
            ) : (
              <RoleSelector
                roles={roles}
                onChange={onChange}
                colorScheme="primary"
              />
            )}
          </ModalBody>
          {data?.length && (
            <ModalFooter
              pt="6"
              pb={{ base: 8, sm: 9 }}
              display="flex"
              justifyContent={"space-between"}
              alignItems="center"
            >
              <Text
                colorScheme={"gray"}
                fontSize="sm"
                fontWeight={"semibold"}
                noOfLines={1}
                mr="2"
              >
                {`${value ? value.split("\n").length : 0} addresses`}
              </Text>
              <ButtonGroup colorScheme="primary" isDisabled={!value.length}>
                <Button
                  h="10"
                  onClick={onCopy}
                  leftIcon={hasCopied ? <Check /> : <Copy />}
                >
                  {`${hasCopied ? "Copied" : "Copy"}`}
                </Button>
                <Button
                  h="10"
                  onClick={exportMembersAsCsv}
                  leftIcon={<DownloadSimple />}
                >
                  Download
                </Button>
              </ButtonGroup>

              <a
                ref={downloadAnchorRef}
                href={csvContent}
                download="members"
                style={{ display: "none" }}
              />
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default MembersExporter
