import {
  Button,
  CloseButton,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Icon,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tag,
  TagLabel,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react"
import ColorCard from "components/common/ColorCard"
import useToast from "hooks/useToast"
import { Gear } from "phosphor-react"
import { useEffect } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { RequirementTypeColors } from "temporaryData/types"

type Props = {
  index: number
  onRemove?: () => void
}

const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i

const WhitelistFormCard = ({ index, onRemove }: Props): JSX.Element => {
  const {
    getValues,
    trigger,
    clearErrors,
    formState: { errors },
    control,
  } = useFormContext()

  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const type = getValues(`requirements.${index}.type`)
  const data = useWatch({ name: `requirements.${index}.data` })

  const validAddress = (address: string) => ADDRESS_REGEX.test(address)

  // Open modal when adding a WhitelistFormCard
  useEffect(() => {
    onOpen()
  }, [])

  const closeModal = () => {
    if (!data || data.length === 0) {
      clearErrors(`requirements.${index}.data`)
      onClose()
      if (typeof onRemove === "function") onRemove()
    } else if (errors?.requirements?.[index]?.data) {
      toast({
        title: "Error",
        description: errors.requirements[index].data.message,
        status: "error",
      })
    } else {
      onClose()
    }
  }

  return (
    <ColorCard color={RequirementTypeColors[type]}>
      {typeof onRemove === "function" && (
        <CloseButton
          position="absolute"
          top={2}
          right={2}
          width={8}
          height={8}
          rounded="full"
          aria-label="Remove requirement"
          zIndex="1"
          onClick={onRemove}
        />
      )}

      <Tag size="lg" mt={6}>
        <IconButton
          variant="ghost"
          icon={<Icon as={Gear} />}
          boxSize={6}
          minH={6}
          minW={6}
          mr={2}
          aria-label="Edit whitelist"
          onClick={onOpen}
        />
        <TagLabel fontSize="sm">{`${data?.length || 0} whitelisted address${
          data?.length > 1 ? "es" : ""
        }`}</TagLabel>
      </Tag>

      <Modal isOpen={isOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create whitelist</ModalHeader>
          <ModalBody>
            <FormControl isRequired isInvalid={errors?.requirements?.[index]?.data}>
              <FormLabel>Whitelisted addresses:</FormLabel>
              <Controller
                control={control}
                name={`requirements.${index}.data`}
                rules={{
                  required: "This field is required.",
                  shouldUnregister: false,
                  validate: () =>
                    !data ||
                    data.every(validAddress) ||
                    "Please input only valid addresses!",
                }}
                render={({ field: { onChange, ref } }) => (
                  <Textarea
                    inputRef={ref}
                    resize="vertical"
                    p={2}
                    size="sm"
                    minH={28}
                    className="custom-scrollbar"
                    cols={42}
                    wrap="off"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    onChange={(e) =>
                      onChange(
                        e.target.value
                          ?.split("\n")
                          .filter((address) => address !== "")
                      )
                    }
                    onBlur={() => trigger(`requirements.${index}.data`)}
                    defaultValue={data?.join("\n")}
                  />
                )}
              />

              <FormHelperText>
                Paste addresses, each one in a new line
              </FormHelperText>
              <FormErrorMessage>
                {errors?.requirements?.[index]?.data?.message}
              </FormErrorMessage>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="indigo" onClick={closeModal}>
              OK
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ColorCard>
  )
}

export default WhitelistFormCard
