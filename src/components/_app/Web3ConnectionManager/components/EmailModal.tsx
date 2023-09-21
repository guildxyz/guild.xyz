import {
  Collapse,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  PinInput,
  PinInputField,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react"
import { useConnect } from "components/[guild]/JoinModal/hooks/useConnectPlatform"
import useUser from "components/[guild]/hooks/useUser"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { PencilSimple } from "phosphor-react"
import { useEffect, useRef, useState } from "react"
import { useController, useForm, useWatch } from "react-hook-form"
import fetcher from "utils/fetcher"

const PIN_LENGTH = 6
const TIMEOUT = 10_000

type EmailModalProps = {
  isOpen: boolean
  onClose: () => void
}

const EmailModal = ({ isOpen, onClose: paramOnClose }: EmailModalProps) => {
  const { emails } = useUser()
  const [pendingEmailAddress, setPendingEmailAddress] = useState(
    emails?.pending ? emails?.emailAddress : null
  )

  const { register, handleSubmit, control, setValue, reset } = useForm<{
    email: string
    code: string
  }>({
    defaultValues: { email: "", code: "" },
  })
  const { field } = useController({ control, name: "code" })
  const email = useWatch({ control, name: "email" })
  const { id: userId } = useUser()
  const toast = useToast()

  const [emailSentAt, setEmailSentAt] = useState<number>(null)

  const submitVerificationRequest = (
    signedPayload: SignedValdation
  ): Promise<{ remainingAttempts: number; success: boolean }> =>
    fetcher(`/v2/users/${userId}/emails`, signedPayload).then((data) => {
      setEmailSentAt(Date.now())
      return data
    })

  const verificationRequest = useSubmitWithSign(submitVerificationRequest)

  const shouldShowPinEntry = !!verificationRequest.response || !!pendingEmailAddress

  const onClose = () => {
    const channel = new BroadcastChannel("EMAIL")
    // Sending null, so useOauthPopup's promise resolves, but we won't send a connect in useConnectPlatform because authData is falsy
    channel.postMessage({ type: "OAUTH_SUCCESS", data: null })
    channel.close()
    verificationRequest.reset()
    reset()
    paramOnClose()
  }

  const submit = handleSubmit((formValues) =>
    verificationRequest.onSubmit({ emailAddress: formValues.email })
  )

  const pinInputRef = useRef<HTMLInputElement>()

  const connect = useConnect(
    () => {
      toast({ status: "success", title: "Email verified" })
      onClose()
    },
    undefined,
    () => {
      setValue("code", "")
      pinInputRef.current?.focus()
    }
  )

  // Set the known pending email address
  useEffect(() => {
    if (!emails?.pending) return
    setPendingEmailAddress(emails?.emailAddress)
    setValue("email", emails?.emailAddress)
  }, [emails])

  // Timer to decide if resend button is disabled
  const [dateNow, setDateNow] = useState(Date.now())
  const canResend = dateNow - emailSentAt > TIMEOUT
  useEffect(() => {
    const interval = setInterval(() => setDateNow(Date.now()), TIMEOUT)
    return () => clearInterval(interval)
  }, [])
  const isResendButtonDisabled = shouldShowPinEntry && !canResend && !connect.error

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalOverlay />
      <ModalContent as="form" onSubmit={submit}>
        <ModalHeader>Connect {shouldShowPinEntry ? email : "Email"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody display={"flex"} flexDir="column">
          <Collapse in={!shouldShowPinEntry} unmountOnExit>
            <FormControl>
              <FormLabel>Email address</FormLabel>
              <Input
                autoFocus
                type="email"
                {...register("email", {
                  required: true,
                  // We should get native validation
                  // pattern: { value: EMAIL_REGEX, message: "Invalid E-Mail address" },
                })}
              />
            </FormControl>
          </Collapse>

          <Collapse in={shouldShowPinEntry} unmountOnExit>
            <VStack spacing={4}>
              <Text textAlign={"center"}>
                Enter the code we've sent to {email}{" "}
                <IconButton
                  size={"xs"}
                  icon={<PencilSimple />}
                  aria-label="Use different email address"
                  onClick={() => {
                    setPendingEmailAddress(null)
                    setValue("code", "")
                    setValue("email", "")
                    connect.reset()
                    verificationRequest.reset()
                  }}
                />
              </Text>
              <HStack justifyContent={"center"}>
                <PinInput
                  isInvalid={connect.error}
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value)
                    if (value.length === PIN_LENGTH) {
                      connect.onSubmit({
                        platformName: "EMAIL",
                        authData: { code: value },
                        emailAddress: email,
                      })
                    }
                  }}
                >
                  <PinInputField autoFocus ref={pinInputRef} />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                </PinInput>
              </HStack>
            </VStack>
          </Collapse>
        </ModalBody>

        <ModalFooter mt={-6}>
          <Tooltip
            label={
              "Check if you received the first code before requesting a new one (check in the spam as well)"
            }
            isDisabled={!isResendButtonDisabled}
          >
            <Button
              w="full"
              isLoading={
                verificationRequest.isLoading ||
                connect.isLoading ||
                connect.isSigning
              }
              size={shouldShowPinEntry ? "sm" : undefined}
              colorScheme={shouldShowPinEntry ? "gray" : "green"}
              type={"submit"}
              isDisabled={isResendButtonDisabled}
            >
              {shouldShowPinEntry ? "Resend code" : "Send code"}
            </Button>
          </Tooltip>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default EmailModal
