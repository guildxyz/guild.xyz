import {
  Alert,
  AlertIcon,
  Box,
  Checkbox,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  ListItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  UnorderedList,
  useDisclosure,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import { domAnimation, LazyMotion, m } from "framer-motion"
import { useEffect, useState } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { GuildFormType, Requirement } from "types"
import shortenHex from "utils/shortenHex"

type Props = {
  index: number
  field: Requirement
}

const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i

const DISPLAYED_ADDRESSES_COUNT = 3

const WhitelistFormCard = ({ index }: Props): JSX.Element => {
  const {
    setValue,
    clearErrors,
    formState: { errors },
    control,
    register,
  } = useFormContext<GuildFormType>()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const [latestValue, setLatestValue] = useState(null)
  const value = useWatch({ name: `requirements.${index}.data.addresses` })
  const isHidden = useWatch({ name: `requirements.${index}.data.hideWhitelist` })
  const [isHiddenInitial] = useState(isHidden)

  // Open modal when adding a new WhitelistFormCard
  useEffect(() => {
    if (!value && !isHiddenInitial) {
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
    setValue(`requirements.${index}.data.addresses`, latestValue)
    onClose()
  }

  const closeModal = () => {
    if (!value || value.length === 0) {
      clearErrors(`requirements.${index}.data.addresses`)
      onClose()
    } else if (!errors?.requirements?.[index]?.data?.addresses) {
      onClose()
    } else {
      onErrorHandler()
    }
  }

  return (
    <>
      {isHidden ? (
        <Box h="full">
          <Text opacity={0.5}>Whitelisted addresses are hidden</Text>
        </Box>
      ) : (
        <>
          <Text fontWeight="medium">{`${
            value?.filter?.(validAddress)?.length ?? 0
          } whitelisted address${value?.length > 1 ? "es" : ""}`}</Text>
          <UnorderedList h="full" w="full" spacing={0} pb="3" pl="1em">
            {value?.length > 0 &&
              value
                .filter(validAddress)
                .slice(0, DISPLAYED_ADDRESSES_COUNT)
                .map((address) => (
                  <ListItem key={address}>{shortenHex(address, 10)}</ListItem>
                ))}
            {value?.length > DISPLAYED_ADDRESSES_COUNT && (
              <Text
                as="span"
                colorScheme={"gray"}
                fontSize="sm"
                ml="-1em"
                lineHeight={4}
              >
                {`... `}
              </Text>
            )}
          </UnorderedList>
        </>
      )}

      <Button w="full" flexShrink="0" mt="auto" onClick={openModal}>
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
                {isHiddenInitial && (
                  <Alert status="warning" mb={5} alignItems="center">
                    <AlertIcon />
                    The provided whitelist will override the previous one
                  </Alert>
                )}

                <FormControl mb={3}>
                  <HStack>
                    <Checkbox
                      fontWeight="medium"
                      sx={{ "> span": { marginLeft: 0, marginRight: 3 } }}
                      m={0}
                      flexFlow="row-reverse"
                      {...register(`requirements.${index}.data.hideWhitelist`)}
                    >
                      Hidden:
                    </Checkbox>
                  </HStack>
                </FormControl>

                <FormControl
                  isRequired
                  isInvalid={!!errors?.requirements?.[index]?.data?.addresses}
                >
                  <FormLabel>Whitelisted addresses:</FormLabel>
                  <Controller
                    control={control}
                    shouldUnregister={false} // Needed if we want to use the addresses after we closed the modal
                    name={`requirements.${index}.data.addresses` as const}
                    rules={{
                      required: "This field is required.",
                      validate: (value_) => {
                        if (
                          !Array.isArray(value_) ||
                          !value_.filter((line) => line !== "").every(validAddress)
                        )
                          return "Please input only valid addresses!"
                        if (value_.length > 50000)
                          return `You've added ${value_.length} addresses but the maximum is 50000`
                      },
                    }}
                    render={({
                      field: { onChange, onBlur, value: textareaValue, ref },
                    }) => (
                      <Textarea
                        ref={ref}
                        resize="vertical"
                        p={2}
                        minH={72}
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
                    {
                      (errors?.requirements?.[index]?.data?.addresses as any)
                        ?.message
                    }
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
