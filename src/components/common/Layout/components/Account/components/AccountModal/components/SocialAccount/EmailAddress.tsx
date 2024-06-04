import {
  ButtonProps,
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
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import useUser from "components/[guild]/hooks/useUser"
import { useConnectEmail } from "components/[guild]/JoinModal/hooks/useConnectPlatform"
import Button from "components/common/Button"
import { Error } from "components/common/Error"
import { Modal } from "components/common/Modal"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { PencilSimple } from "phosphor-react"
import rewards from "platforms/rewards"
import { useEffect, useRef, useState } from "react"
import { useController, useForm, useWatch } from "react-hook-form"
import fetcher from "utils/fetcher"
import { useDisconnectEmail } from "../../hooks/useDisconnect"
import DisconnectAccountButton from "./components/DisconnectAccountButton"
import SocialAccountUI from "./components/SocialAccountUI"
import processEmailError from "./utils/processEmailError"

const TOO_MANY_ATTEMPTS_ERROR =
  "The code has been invalidated due to too many attempts"

const EmailAddress = () => {
  const { emails } = useUser()
  const isConnected = !!emails?.emailAddress && !emails.pending

  return (
    <SocialAccountUI
      type={"EMAIL"}
      username={emails?.emailAddress}
      isConnected={isConnected}
    >
      {isConnected ? <DisconnectEmailButton /> : <ConnectEmailButton />}
    </SocialAccountUI>
  )
}

const PIN_LENGTH = 6
const TIMEOUT = 10_000

const ConnectEmailButton = ({
  onSuccess,
  isReconnection: _,
  ...props
}: ButtonProps & { onSuccess?: () => void; isReconnection?: boolean }) => {
  const { emails } = useUser()
  const { isOpen, onOpen, onClose } = useDisclosure()
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
    signedPayload: SignedValidation
  ): Promise<{ remainingAttempts: number; success: boolean }> =>
    fetcher(`/v2/users/${userId}/emails`, signedPayload).then((data) => {
      setEmailSentAt(Date.now())
      return data
    })

  const verificationRequest = useSubmitWithSign(submitVerificationRequest)

  const shouldShowPinEntry = !!verificationRequest.response || !!pendingEmailAddress

  const handleOnClose = () => {
    verificationRequest.reset()
    reset()
    if (emails?.emailAddress) {
      setPendingEmailAddress(emails.emailAddress)
      setValue("email", emails.emailAddress)
    }
    onClose()
  }

  const submit = handleSubmit((formValues) =>
    verificationRequest.onSubmit({ emailAddress: formValues.email })
  )

  const pinInputRef = useRef<HTMLInputElement>()

  const differentEmail = () => {
    setPendingEmailAddress(null)
    setValue("code", "")
    setValue("email", "")
    connect.reset()
    verificationRequest.reset()
  }

  const connect = useConnectEmail({
    onSuccess: () => {
      if (onSuccess) {
        onSuccess()
      } else {
        toast({ status: "success", title: "Email verified" })
      }
      handleOnClose()
    },
    onError: (error) => {
      if (error?.error?.includes(TOO_MANY_ATTEMPTS_ERROR)) {
        differentEmail()
        return
      }
      setValue("code", "")
      pinInputRef.current?.focus()
    },
  })

  // Set the known pending email address
  useEffect(() => {
    if (!emails?.pending) return
    setPendingEmailAddress(emails?.emailAddress)
    setValue("email", emails?.emailAddress)
  }, [emails, setValue])

  // Timer to decide if resend button is disabled
  const [dateNow, setDateNow] = useState(Date.now())
  const canResend = dateNow - emailSentAt > TIMEOUT
  useEffect(() => {
    const interval = setInterval(() => setDateNow(Date.now()), TIMEOUT)
    return () => clearInterval(interval)
  }, [])
  const isResendButtonDisabled = shouldShowPinEntry && !canResend && !connect.error

  return (
    <>
      <Button
        onClick={onOpen}
        colorScheme={emails?.pending ? "orange" : rewards.EMAIL.colorScheme}
        variant={"solid"}
        size="sm"
        {...props}
      >
        {emails?.pending ? "Verify" : "Connect"}
      </Button>
      <Modal isOpen={isOpen} onClose={handleOnClose} size="sm">
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={submit}>
            <ModalHeader>Connect email</ModalHeader>
            <ModalCloseButton />
            <ModalBody display={"flex"} flexDir="column" pb="8" pt="1">
              <Error
                error={verificationRequest.error ?? connect.error}
                processError={processEmailError}
              />

              <Collapse
                in={!shouldShowPinEntry}
                unmountOnExit
                style={{ padding: "1px" }}
              >
                <FormControl>
                  <FormLabel>Email address</FormLabel>
                  <Input
                    autoFocus
                    type="email"
                    placeholder="me@example.com"
                    {...register("email", {
                      required: true,
                      // We should get native validation
                      // pattern: { value: EMAIL_REGEX, message: "Invalid E-Mail address" },
                    })}
                  />
                </FormControl>
              </Collapse>
              <Collapse
                in={shouldShowPinEntry}
                unmountOnExit
                style={{ padding: "1px" }}
              >
                <VStack spacing={4}>
                  <Text textAlign={"center"}>
                    Enter the code we've sent to {email}{" "}
                    <IconButton
                      size={"xs"}
                      icon={<PencilSimple />}
                      aria-label="Use different email address"
                      onClick={differentEmail}
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
            <ModalFooter>
              {shouldShowPinEntry ? (
                <Tooltip
                  label={
                    "Check if you received the first code before requesting a new one (check in the spam as well)"
                  }
                  hasArrow
                  isDisabled={!isResendButtonDisabled}
                >
                  <Button
                    w="full"
                    isLoading={connect.isLoading || connect.isSigning}
                    size={"sm"}
                    borderRadius="lg"
                    variant={"ghost"}
                    type={"submit"}
                    isDisabled={isResendButtonDisabled}
                  >
                    Resend code
                  </Button>
                </Tooltip>
              ) : (
                <Button
                  w="full"
                  isLoading={verificationRequest.isLoading}
                  colorScheme={"green"}
                  type={"submit"}
                >
                  Send code
                </Button>
              )}
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  )
}

const DisconnectEmailButton = () => {
  const disclosure = useDisclosure()
  const { emails } = useUser()

  const { onSubmit, isLoading, signLoadingText } = useDisconnectEmail(
    disclosure.onClose
  )
  const onConfirm = () => onSubmit(emails?.emailAddress)
  const loadingText = signLoadingText ?? "Removing"

  return (
    <DisconnectAccountButton
      name={rewards.EMAIL.name}
      {...{ disclosure, isLoading, loadingText, onConfirm }}
    />
  )
}

export { ConnectEmailButton }
export default EmailAddress
