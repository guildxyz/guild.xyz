import {
  Checkbox,
  Divider,
  FormControl,
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
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import useGuild from "components/[guild]/hooks/useGuild"
import { domAnimation, LazyMotion, m } from "framer-motion"
import { useEffect, useState } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { GuildFormType, Requirement } from "types"
import mapRequirements from "utils/mapRequirements"

type Props = {
  index: number
  field: Requirement
}

const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i

const AllowlistFormCard = ({ index }: Props): JSX.Element => {
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
  const requirementId = useWatch({ name: `requirements.${index}.id` })
  const roleId = useWatch({ name: `roleId` })
  const isHidden = useWatch({ name: `requirements.${index}.data.hideAllowlist` })
  const [isEditing] = useState(typeof isHidden === "boolean")
  const [isHiddenInitial] = useState(isHidden)
  const { isSigning, fetchAsOwner, fetchedAsOwner, isLoading, roles } = useGuild()
  const [openOnFetch, setOpenOnFetch] = useState<boolean>(false)

  const openModal = () => {
    setLatestValue(value)
    onOpen()
  }

  useEffect(() => {
    if (!fetchedAsOwner) return
    const role = roles?.find(({ id }) => id === roleId)
    if (!role) return
    const newRequirement = role.requirements?.find(({ id }) => id === requirementId)
    if (newRequirement?.data?.hideAllowlist) {
      const newMappedRequirement = mapRequirements([newRequirement])[0]
      setValue(
        `requirements.${index}.data.addresses`,
        newMappedRequirement.data.addresses
      )
      if (openOnFetch) {
        setOpenOnFetch(false)
        setLatestValue(newMappedRequirement.data?.addresses ?? [])
        onOpen()
      }
    }
  }, [
    requirementId,
    index,
    openOnFetch,
    fetchedAsOwner,
    roles,
    roleId,
    setValue,
    onOpen,
  ])

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
      <Text fontWeight="medium">{`${
        value?.filter?.(validAddress)?.length ?? 0
      } allowlisted address${value?.length > 1 ? "es" : ""}`}</Text>
      <Divider />
      <FormControl mb={3}>
        <Checkbox
          fontWeight="medium"
          {...register(`requirements.${index}.data.hideAllowlist`)}
          checked={isHidden}
        >
          Make allowlist private
        </Checkbox>
      </FormControl>

      <Button
        w="full"
        flexShrink="0"
        mt="auto !important"
        isLoading={
          /*isHiddenInitial &&
          isEditing &&
          !fetchedAsOwner &&
          (isSigning || isLoading) && */ openOnFetch
        }
        loadingText={isSigning ? "Check your wallet" : "Loading"}
        onClick={
          !isHiddenInitial || !isEditing || fetchedAsOwner
            ? openModal
            : () => {
                setOpenOnFetch(true)
                fetchAsOwner()
              }
        }
      >
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
                <FormControl
                  isRequired
                  isInvalid={!!errors?.requirements?.[index]?.data?.addresses}
                >
                  <FormLabel>Allowlisted addresses:</FormLabel>
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

export default AllowlistFormCard
