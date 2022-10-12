import {
  Checkbox,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  IconButton,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import { Modal } from "components/common/Modal"
import { domAnimation, LazyMotion, m } from "framer-motion"
import useDropzone from "hooks/useDropzone"
import { Check, File, TrashSimple } from "phosphor-react"
import { useEffect, useState } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { FormCardProps } from "types"
import parseFromObject from "utils/parseFromObject"

const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i

const AllowlistFormCard = ({ baseFieldPath }: FormCardProps): JSX.Element => {
  const {
    setValue,
    clearErrors,
    formState: { errors },
    control,
    register,
  } = useFormContext()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const [latestValue, setLatestValue] = useState(null)
  const value = useWatch({ name: `${baseFieldPath}data.addresses` })
  const isHidden = useWatch({ name: `${baseFieldPath}data.hideAllowlist` })

  const openModal = () => {
    setLatestValue(value)
    onOpen()
  }

  // Open modal when adding a new AllowlistFormCard
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

  const cancelModal = () => {
    setValue(`${baseFieldPath}data.addresses`, latestValue)
    onClose()
  }

  const closeModal = () => {
    if (!value || value.length === 0) {
      clearErrors(`${baseFieldPath}data.addresses`)
      setRegexError(null)
      onClose()
    } else if (!parseFromObject(errors, baseFieldPath)?.data?.addresses) {
      setRegexError(null)
      onClose()
    } else {
      onErrorHandler()
    }
  }

  const {
    isDragActive,
    fileRejections,
    getRootProps,
    getInputProps,
    acceptedFiles,
    inputRef,
  } = useDropzone({
    multiple: false,
    accept: { "text/*": [".csv", ".txt"] },
    onDrop: (accepted) => {
      if (accepted.length > 0) parseFile(accepted[0])
    },
  })

  const [regexError, setRegexError] = useState(null)

  const parseFile = (file: File) => {
    const fileReader = new FileReader()

    fileReader.onload = () => {
      setRegexError(null)
      const lines = fileReader.result
        ?.toString()
        ?.split("\n")
        ?.filter((line) => !!line)
        ?.map((line) => line.slice(0, 42))

      if (!lines.every((line) => ADDRESS_REGEX.test(line))) {
        setRegexError("Your file contains invalid addresses!")
        return
      }

      setValue(`${baseFieldPath}data.addresses`, lines)
    }

    fileReader.readAsText(file)
  }

  const resetList = () => {
    if (inputRef.current) {
      inputRef.current.value = null
      acceptedFiles?.splice(0, acceptedFiles?.length)
    }
    clearErrors(`${baseFieldPath}data.addresses`)
    setValue(`${baseFieldPath}data.addresses`, [])
    setRegexError(null)
  }

  return (
    <>
      <Text fontWeight="medium">
        {value?.filter?.(validAddress)?.length ?? 0} allowlisted address
        {value?.length > 1 ? "es" : ""}
      </Text>
      <Divider />
      <FormControl pb={3}>
        <Checkbox
          fontWeight="medium"
          {...register(`${baseFieldPath}data.hideAllowlist`)}
          checked={isHidden}
        >
          Make allowlist private
        </Checkbox>
      </FormControl>

      <Button w="full" flexShrink="0" mt="auto !important" onClick={openModal}>
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
              <ModalHeader>Create allowlist</ModalHeader>
              <ModalBody>
                <Stack w="full" spacing={4}>
                  <FormControl
                    isInvalid={!!fileRejections?.[0] || !!regexError}
                    textAlign="left"
                  >
                    <FormLabel>Upload allowList</FormLabel>
                    <HStack>
                      {!value?.filter((line) => !!line)?.length ||
                      !!parseFromObject(errors, baseFieldPath)?.data?.addresses ? (
                        <Button
                          {...getRootProps()}
                          as="label"
                          leftIcon={<File />}
                          h={10}
                          w="full"
                          maxW={56}
                        >
                          <input {...getInputProps()} hidden />
                          <Text as="span" display="block" maxW={44} noOfLines={1}>
                            {isDragActive && !value?.length
                              ? "Drop the file here"
                              : "Upload .txt/.csv"}
                          </Text>
                        </Button>
                      ) : (
                        <Button leftIcon={<Check />} h={10} disabled>
                          Uploaded allowlist
                        </Button>
                      )}

                      <IconButton
                        aria-label="Remove whitelist"
                        icon={<Icon as={TrashSimple} />}
                        colorScheme="red"
                        variant="ghost"
                        h={10}
                        onClick={resetList}
                        isDisabled={!value?.filter((line) => !!line)?.length}
                      />
                    </HStack>
                    <FormErrorMessage>
                      {fileRejections?.[0]?.errors?.[0]?.message || regexError}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl
                    isRequired
                    isInvalid={
                      !!parseFromObject(errors, baseFieldPath)?.data?.addresses
                    }
                  >
                    <Controller
                      control={control}
                      shouldUnregister={false} // Needed if we want to use the addresses after we closed the modal
                      name={`${baseFieldPath}data.addresses` as const}
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
                          placeholder="Upload a file or paste addresses, each one in a new line"
                        />
                      )}
                    />
                    <FormErrorMessage>
                      {
                        (
                          parseFromObject(errors, baseFieldPath)?.data
                            ?.addresses as any
                        )?.message
                      }
                    </FormErrorMessage>
                  </FormControl>
                </Stack>
              </ModalBody>

              <ModalFooter>
                <Button onClick={cancelModal}>Cancel</Button>
                <Button ml={3} colorScheme="indigo" onClick={closeModal}>
                  Done
                </Button>
              </ModalFooter>
            </m.div>
          </LazyMotion>
        </ModalContent>
      </Modal>
    </>
  )
}

export default AllowlistFormCard
