import {
  Box,
  Button,
  Center,
  Divider,
  FormControl,
  FormErrorMessage,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  UnorderedList,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react"
import StyledSelect from "components/common/StyledSelect"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildMembers from "hooks/useGuildMembers"
import { ArrowSquareOut } from "phosphor-react"
import { useMemo } from "react"
import { Controller, useForm, useFormContext, useWatch } from "react-hook-form"
import { SelectOption } from "types"
import shortenHex from "utils/shortenHex"

const Admins = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { setValue, control } = useFormContext()
  const { admins: guildAdmins } = useGuild()
  const ownerAddress = useMemo(
    () => guildAdmins?.find((admin) => admin.isOwner)?.address,
    [guildAdmins]
  )
  const admins = useWatch({ name: "admins" })
  const addressShorten = useBreakpointValue({ base: 10, sm: 15, md: -1 })

  const { showMembers } = useGuild()

  const members = useGuildMembers()
  const memberOptions = useMemo(
    () =>
      [...members]
        .filter((address) => !admins.includes(address) && address !== ownerAddress)
        .map((member) => ({ label: member, value: member })),
    [members, admins, ownerAddress]
  )

  const form = useForm({
    mode: "all",
    defaultValues: { adminInput: "", admins },
    shouldFocusError: true,
  })

  const adminInput = useWatch({ name: "adminInput", control: form.control })
  const editedAdmins = useWatch({ name: "admins", control: form.control })

  const closeModal = () => {
    form.clearErrors("adminInput")
    onClose()
  }

  const cancel = () => {
    form.clearErrors("adminInput")
    form.setValue("admins", admins)
    onClose()
  }

  const save = () => {
    form.clearErrors("adminInput")
    setValue("admins", editedAdmins)
    onClose()
  }

  return (
    <>
      <HStack spacing={5}>
        <Text colorScheme="gray">
          There are currently {admins.length ?? 0} admin addresses.
        </Text>
        <Button
          px={0}
          variant="ghost"
          fontWeight="medium"
          fontSize="sm"
          h="10"
          w="min"
          rightIcon={<ArrowSquareOut />}
          iconSpacing="3"
          _hover={{ bgColor: null }}
          _active={{ bgColor: null }}
          onClick={onOpen}
        >
          {admins.length > 0 ? "Edit list" : "Add some"}
        </Button>
      </HStack>

      <Modal isOpen={isOpen} onClose={closeModal} scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent maxW="xl">
          <ModalHeader>Admin addresses</ModalHeader>
          <ModalBody>
            <FormControl w="full" isInvalid={!!form.formState.errors.adminInput}>
              <InputGroup size="md">
                <Input
                  size="md"
                  pr="4.5rem"
                  textOverflow="ellipsis"
                  placeholder="Add a new address"
                  {...form.register("adminInput", {
                    pattern: {
                      value: /^0x[0-9a-f]{40}$/i,
                      message: "Has to be a valid address",
                    },
                    validate: (value) =>
                      !editedAdmins.includes(value.toLowerCase()) ||
                      "This address is already added",
                  })}
                />
                <InputRightElement width="4.5rem">
                  <Button
                    isDisabled={adminInput?.length <= 0}
                    h="1.75rem"
                    size="sm"
                    onClick={form.handleSubmit((value) => {
                      form.setValue("admins", [
                        ...editedAdmins,
                        value.adminInput.toLowerCase(),
                      ])
                      form.setValue("adminInput", "")
                    })}
                  >
                    Add
                  </Button>
                </InputRightElement>
              </InputGroup>

              <FormErrorMessage>
                {form.formState.errors.adminInput?.message}
              </FormErrorMessage>
            </FormControl>

            {showMembers && memberOptions?.length > 0 && (
              <>
                <Center my={2}>
                  <Text color="gray" fontWeight="semibold" fontSize="xs">
                    OR
                  </Text>
                </Center>
                <Controller
                  control={form.control}
                  name="admins"
                  render={({ field: { onChange, onBlur, ref } }) => (
                    <StyledSelect
                      placeholder="Select from members"
                      ref={ref}
                      options={memberOptions}
                      value=""
                      onChange={(selectedOption: SelectOption) => {
                        onChange([...editedAdmins, selectedOption?.value])
                      }}
                      onBlur={onBlur}
                    />
                  )}
                />
              </>
            )}

            <Center>
              <Divider my={5} w="sm" />
            </Center>

            <Center w="full" overflowY="auto">
              <UnorderedList w="min" maxH="300px" m={0}>
                {editedAdmins?.length ? (
                  editedAdmins.map((address) => (
                    <Box key={address}>
                      <Tag
                        size="lg"
                        borderRadius="full"
                        variant="solid"
                        colorScheme="gray"
                        my={2}
                        w="full"
                        justifyContent="space-between"
                      >
                        <TagLabel>
                          {addressShorten > 0
                            ? shortenHex(address, addressShorten)
                            : address}
                        </TagLabel>
                        <TagCloseButton
                          onClick={() =>
                            form.setValue(
                              "admins",
                              editedAdmins.filter(
                                (adminAddress) => adminAddress !== address
                              )
                            )
                          }
                        />
                      </Tag>
                    </Box>
                  ))
                ) : (
                  <Text colorScheme={"gray"} whiteSpace="nowrap">
                    {editedAdmins.length <= 0 ? "No admin addresses" : "No results"}
                  </Text>
                )}
              </UnorderedList>
            </Center>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="primary" variant="ghost" mr={5} onClick={cancel}>
              Cancel
            </Button>
            <Button colorScheme="primary" onClick={save}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default Admins
