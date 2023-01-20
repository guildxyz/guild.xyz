import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  ButtonGroup,
  CheckboxGroup,
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
  useBreakpointValue,
  useClipboard,
  useDisclosure,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import useGuild from "components/[guild]/hooks/useGuild"
import RoleOptionCard from "components/[guild]/RoleOptionCard"
import { Check, Copy, DownloadSimple, Export } from "phosphor-react"
import { useEffect, useRef, useState } from "react"
import useSWRImmutable from "swr/immutable"

const MembersExporter = (): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { id, roles } = useGuild()
  const { data, isValidating } = useSWRImmutable(
    isOpen ? `/guild/${id}/members` : null
  )

  const aRef = useRef(null)
  const label = useBreakpointValue({ base: "Export", sm: "Export members" })

  const [selectedRoles, setSelectedRoles] = useState([])

  const { hasCopied, value, setValue, onCopy } = useClipboard("")
  const csvContent = encodeURI("data:text/csv;charset=utf-8," + value)

  useEffect(() => {
    if (!selectedRoles || !data) return

    setValue(
      [
        ...new Set(
          data
            ?.filter((role) => selectedRoles.includes(role.roleId.toString()))
            ?.map((role) => role.members)
            ?.reduce((a, b) => a.concat(b), [])
            ?.filter((member) => !!member) ?? []
        ),
      ].join("\n")
    )
  }, [selectedRoles, data])

  const exportMembersAsCsv = () => {
    if (!aRef.current) return
    aRef.current.click()
  }

  const handleClose = () => {
    onClose()
    setValue("")
  }

  return (
    <>
      <Button
        aria-label="Export members"
        variant="ghost"
        leftIcon={<Icon as={Export} />}
        size="sm"
        data-dd-action-name="Export members"
        onClick={onOpen}
      >
        {label}
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
              <CheckboxGroup
                onChange={(newList) => setSelectedRoles(newList)}
                colorScheme="primary"
              >
                <Stack>
                  {roles?.map((role) => (
                    <RoleOptionCard key={role.id} role={role} />
                  ))}
                </Stack>
              </CheckboxGroup>
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
                ref={aRef}
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
