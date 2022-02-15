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
import { DotsThreeVertical, ListChecks } from "phosphor-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { RequirementFormField } from "types"

type Props = {
  index: number
  field: RequirementFormField
}

const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i

const WhitelistFormCard = ({ index }: Props): JSX.Element => {
  const contentRef = useRef<HTMLDivElement>(null)

  const displayedAddressesCount = useMemo(() => {
    if (!contentRef.current) return 5 // Default value
    const contentHeight = contentRef.current.offsetHeight
    // 128 is the height of the DotsThreeVertical icon, the "x more addresses" text and the "" buttonEdit list
    console.log("Content height:", contentHeight)
    console.log("Max displayable addresses", Math.floor((contentHeight - 128) / 32))
    return Math.floor((contentHeight - 96) / 32)
  }, [contentRef.current?.offsetHeight])

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
        ? value.filter((address) => address !== "").slice(0, displayedAddressesCount)
        : [],
    [value, displayedAddressesCount]
  )

  const moreAddresses = useMemo(
    () =>
      Array.isArray(value) && value?.every(validAddress)
        ? value.filter((address) => address !== "").length - displayedAddressesCount
        : 0,
    [value, displayedAddressesCount]
  )

  return (
    <Flex ref={contentRef} direction="column" w="full" h="full">
      <VStack w="full" spacing={0}>
        {displayedAddresses?.length > 0 ? (
          displayedAddresses.map((address) => (
            <Flex key={address} alignItems="center" w="full" h={8}>
              <Text as="span" isTruncated>
                {address}
              </Text>
            </Flex>
          ))
        ) : (
          <Icon as={ListChecks} my={4} boxSize={40} textColor="gray" />
        )}
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
              pb={4}
            >
              {`${moreAddresses} more address${moreAddresses > 1 ? "es" : ""}`}
            </Text>
          </>
        )}
      </VStack>
      <Button w="full" mt="auto" onClick={openModal}>
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
                      validate: (value_) => {
                        if (!Array.isArray(value_) || !value_.every(validAddress))
                          return "Please input only valid addresses!"
                        if (value_.length > 50000)
                          return "You can add up to 50000 addresses"
                      },
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
    </Flex>
  )
}

export default WhitelistFormCard
