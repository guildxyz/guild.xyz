import {
  Button,
  CloseButton,
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
import ColorCard from "components/common/ColorCard"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
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

  const type = getValues(`requirements.${index}.type`)
  const data = useWatch({ name: `requirements.${index}.data` })

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

  // Open modal when adding a WhitelistFormCard
  useEffect(() => {
    onOpen()
  }, [])

  const closeModal = () => {
    if (!data || data.length === 0) {
      clearErrors(`requirements.${index}.data`)
      onClose()
      if (typeof onRemove === "function") onRemove()
    } else if (!errors?.requirements?.[index]?.data) {
      onClose()
    } else {
      onErrorHandler()
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

      <Text mb={2} as="span" fontWeight="medium">
        Whitelist
      </Text>
      <Text mb={8} fontSize="sm">{`${data?.length || 0} whitelisted address${
        data?.length > 1 ? "es" : ""
      }`}</Text>
      <Button onClick={onOpen}>Edit list</Button>

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
                isInvalid={errors?.requirements?.[index]?.data}
              >
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
          </motion.div>
        </ModalContent>
      </Modal>
    </ColorCard>
  )
}

export default WhitelistFormCard
