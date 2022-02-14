import {
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import { domAnimation, LazyMotion, m } from "framer-motion"
import { DotsThreeVertical } from "phosphor-react"
import { useEffect, useMemo, useState } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { RequirementFormField } from "types"

type Props = {
  index: number
  field: RequirementFormField
}

const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i

const DISPALYED_ADDRESSES = 5

const WhitelistFormCard = ({ index }: Props): JSX.Element => {
  const {
    setValue,
    clearErrors,
    formState: { errors },
    control,
  } = useFormContext()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const [latestValue, setLatestValue] = useState(null)
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

  const validAddress = (address: string) =>
    address === "" || ADDRESS_REGEX.test(address)

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
    } else if (!errors?.requirements?.[index]?.value) {
      onClose()
    } else {
      onErrorHandler()
    }
  }

  const displayedAddresses = useMemo(
    () =>
      Array.isArray(value) && value?.every(validAddress)
        ? value.filter((address) => address !== "").slice(0, DISPALYED_ADDRESSES)
        : [],
    [value]
  )

  const moreAddresses = useMemo(
    () =>
      Array.isArray(value) && value?.every(validAddress)
        ? value.filter((address) => address !== "").length - DISPALYED_ADDRESSES
        : 0,
    [value]
  )

  return (
    <>
      <VStack w="full" spacing={0}>
        {displayedAddresses.map((address) => (
          <Flex
            key={address}
            alignItems="center"
            w="full"
            h={8}
            borderBottomWidth={1}
            _last={{
              borderBottomWidth: 0,
            }}
          >
            <Text as="span" isTruncated>
              {address}
            </Text>
          </Flex>
        ))}
        {moreAddresses > 0 && (
          <>
            <Icon as={DotsThreeVertical} boxSize={6} textColor="gray" />

            <Text
              as="span"
              isTruncated
              fontWeight="bold"
              fontSize="sm"
              textTransform="uppercase"
              pt={2}
            >
              {`${moreAddresses} more address${moreAddresses > 1 ? "es" : ""}`}
            </Text>
          </>
        )}
      </VStack>
      <Button w="full" onClick={openModal}>
        Edit list
      </Button>

      <Modal size="xl" isOpen={isOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <LazyMotion features={domAnimation}>
            <m.div
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
                    shouldUnregister={false} // Needed if we want to use the addresses after we closed the modal
                    name={`requirements.${index}.value` as const}
                    rules={{
                      required: "This field is required.",
                      validate: (value_) =>
                        (Array.isArray(value_) && value_.every(validAddress)) ||
                        "Please input only valid addresses!",
                    }}
                    render={({
                      field: { onChange, onBlur, value: textareaValue, ref },
                    }) => (
                      <Textarea
                        ref={ref}
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
                        value={textareaValue?.join("\n") || ""}
                        onChange={(e) => onChange(e.target.value?.split("\n"))}
                        onBlur={onBlur}
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
                <Button onClick={cancelModal}>Cancel</Button>
                <Button ml={3} colorScheme="indigo" onClick={closeModal}>
                  OK
                </Button>
              </ModalFooter>
            </m.div>
          </LazyMotion>
        </ModalContent>
      </Modal>
    </>
  )
}

export default WhitelistFormCard
