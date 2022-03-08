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
  ModalCloseButton,
  ModalContent,
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
import { ArrowSquareOut } from "phosphor-react"
import { useEffect, useMemo } from "react"
import { useForm, useFormContext, useWatch } from "react-hook-form"
import { FixedSizeList } from "react-window"
import shortenHex from "utils/shortenHex"

const Admins = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { setValue } = useFormContext()
  const admins = useWatch({ name: "admins", defaultValue: [] })
  const itemSize = useBreakpointValue({ base: 55, md: 25 })
  const addressShorten = useBreakpointValue({ base: 10, sm: 15, md: -1 })

  const form = useForm({
    mode: "all",
    defaultValues: { adminInput: "", adminSearch: "" },
    shouldFocusError: true,
  })

  const closeModal = () => {
    form.clearErrors("adminInput")
    onClose()
  }

  const adminInput = useWatch({ name: "adminInput", control: form.control })
  const adminSearch = useWatch({ name: "adminSearch", control: form.control })

  const filtered = useMemo(
    () => admins.filter((address) => new RegExp(adminSearch, "i").test(address)),
    [adminSearch, admins]
  )

  useEffect(() => console.log(admins), [admins])

  const Row = ({ index }) => (
    <Box key={index}>
      <Tag
        size="lg"
        borderRadius="full"
        variant="solid"
        colorScheme="gray"
        w="min"
        my={2}
      >
        <TagLabel>
          {addressShorten > 0
            ? shortenHex(filtered[index], addressShorten)
            : filtered[index]}
        </TagLabel>
        <TagCloseButton
          onClick={() =>
            setValue(
              "admins",
              admins.filter((address) => address !== filtered[index])
            )
          }
        />
      </Tag>
    </Box>
  )

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
          <ModalCloseButton />
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
                      !admins.includes(value) || "This address is already added",
                  })}
                />
                <InputRightElement width="4.5rem">
                  <Button
                    isDisabled={adminInput?.length <= 0}
                    h="1.75rem"
                    size="sm"
                    onClick={form.handleSubmit((value) =>
                      setValue("admins", [...admins, value.adminInput])
                    )}
                  >
                    Add
                  </Button>
                </InputRightElement>
              </InputGroup>

              <FormErrorMessage>
                {form.formState.errors.adminInput?.message}
              </FormErrorMessage>
            </FormControl>

            <Center>
              <Divider my={5} w="sm" />
            </Center>

            <UnorderedList
              m={0}
              sx={{ "> div": { overflow: "hidden auto !important" } }}
            >
              {filtered?.length ? (
                <FixedSizeList
                  height={300}
                  itemCount={filtered.length}
                  itemSize={itemSize}
                  className="custom-scrollbar"
                >
                  {Row}
                </FixedSizeList>
              ) : (
                <Text colorScheme={"gray"} h="350">
                  {admins.length <= 0 ? "No admin addresses" : "No results"}
                </Text>
              )}
            </UnorderedList>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default Admins
