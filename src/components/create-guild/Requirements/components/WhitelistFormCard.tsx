import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { RequirementTypeColors } from "temporaryData/types"
import FormCard from "./FormCard"

type Props = {
  index: number
  onRemove?: () => void
}

const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i

const WhitelistFormCard = ({ index, onRemove }: Props): JSX.Element => {
  const {
    getValues,
    setValue,
    trigger,
    clearErrors,
    formState: { errors },
    control,
  } = useFormContext()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const [latestValue, setLatestValue] = useState(null)
  const type = getValues(`requirements.${index}.type`)
  const value = useWatch({ name: `requirements.${index}.value` })

  // Open modal when adding a new WhitelistFormCard
  useEffect(() => {
    if (!value) {
      onOpen()
    }
  }, [])

  const [errorAnimation, setErrorAnimation] = useState<string | string[]>(
    "translateX(0px)"
  )
  const onErrorHandler = () =>
    setErrorAnimation([
      "translateX(0px) translateY(0px)",
      "translateX(-20px) translateY(0)",
      "translateX(20px) translateY(15px)",
      "translateX(-20px) translateY(5px)",
      "translateX(20px) translateY(5px)",
      "translateX(-20px) translateY(15px)",
      "translateX(20px) translateY(0px)",
      "translateX(0px) translateY(0px)",
    ])

  const validAddress = (address: string) => ADDRESS_REGEX.test(address)

  const openModal = () => {
    setLatestValue(value)
    onOpen()
  }

  const cancelModal = () => {
    setValue(`requirements.${index}.value`, latestValue)
    onClose()
  }

  const closeModal = () => {
    if (!value || value.length === 0) {
      clearErrors(`requirements.${index}.value`)
      onClose()
      if (typeof onRemove === "function") onRemove()
    } else if (!errors?.requirements?.[index]?.value) {
      onClose()
    } else {
      onErrorHandler()
    }
  }

  return (
    <FormCard color={RequirementTypeColors.WHITELIST} onRemove={onRemove}>
      <Text mb={2} as="span" fontWeight="medium">
        Whitelist
      </Text>
      <Text mb={8} fontSize="sm" colorScheme="gray">{`${
        (value?.every(validAddress) && value?.length) || 0
      } whitelisted address${value?.length > 1 ? "es" : ""}`}</Text>
      <Button onClick={openModal}>Edit list</Button>

      <Modal size="xl" isOpen={isOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <motion.div
            onAnimationComplete={() => setErrorAnimation("translateX(0px)")}
            style={{
              position: "relative",
              transformOrigin: "bottom center",
              transform: "translateX(0px)",
            }}
            animate={{
              transform: errorAnimation,
            }}
            transition={{ duration: 0.4 }}
          >
            <ModalHeader>Create whitelist</ModalHeader>
            <ModalBody>
              <FormControl
                isRequired
                isInvalid={errors?.requirements?.[index]?.value}
              >
                <FormLabel>Whitelisted addresses:</FormLabel>
                <Controller
                  control={control}
                  name={`requirements.${index}.value`}
                  rules={{
                    required: "This field is required.",
                    shouldUnregister: false,
                    validate: () =>
                      !value ||
                      value.every(validAddress) ||
                      "Please input only valid addresses!",
                  }}
                  render={({ field: { onChange, ref } }) => (
                    <Textarea
                      inputRef={ref}
                      resize="vertical"
                      p={2}
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
                      onBlur={() => trigger(`requirements.${index}.value`)}
                      defaultValue={value?.join("\n")}
                    />
                  )}
                />

                <FormHelperText>
                  Paste addresses, each one in a new line
                </FormHelperText>
                <FormErrorMessage>
                  {errors?.requirements?.[index]?.value?.message}
                </FormErrorMessage>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button maxW="max-content" onClick={cancelModal}>
                Cancel
              </Button>
              <Button ml={3} colorScheme="indigo" onClick={closeModal}>
                OK
              </Button>
            </ModalFooter>
          </motion.div>
        </ModalContent>
      </Modal>
    </FormCard>
  )
}

export default WhitelistFormCard
