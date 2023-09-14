import {
  Center,
  FormControl,
  FormLabel,
  HStack,
  Input,
  PinInput,
  PinInputField,
  VStack,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import Card from "components/common/Card"
import useSubmit from "hooks/useSubmit"
import { useRouter } from "next/router"
import { useController, useForm, useWatch } from "react-hook-form"
import { useFetcherWithSignWithKeyPairOfUser } from "utils/fetcher"
import timeoutPromise from "utils/timeoutPromise"
import { OAUTH_CONFIRMATION_TIMEOUT_MS } from "./oauth"

const PIN_LENGTH = 6

const EmailVerificationPage = () => {
  const router = useRouter()
  const address = router?.query?.address?.toString()
  const fetcherWithSign = useFetcherWithSignWithKeyPairOfUser(address)

  const { register, handleSubmit, control, setValue } = useForm<{
    email: string
    code: string
  }>({
    defaultValues: { email: "", code: "" },
  })
  const { field } = useController({ control, name: "code" })
  const code = useWatch({ control, name: "code" })

  const submitVerificationRequest = async (emailAddress: string) => {
    return true
    const verificationResponse = await fetcherWithSign([
      `/v2/email/verifications`,
      { method: "POST", body: { emailAddress } },
    ])

    return verificationResponse
  }

  const {
    onSubmit: onSubmitVerificationRequest,
    isLoading: isVerificationRequestLoading,
    response: verificationRequestResponse,
    reset: resetVerificationRequest,
  } = useSubmit(submitVerificationRequest)

  const { from, csrfToken } =
    typeof window === "undefined"
      ? { from: null, csrfToken: null }
      : JSON.parse(window.localStorage.getItem(`EMAIL_oauthinfo`) ?? "{}")

  const sendCodeBackToMainWindow = (code: string) => {
    const channel = new BroadcastChannel(csrfToken)

    const isMessageConfirmed = timeoutPromise(
      new Promise<void>((resolve) => {
        channel.onmessage = () => resolve()
      }),
      OAUTH_CONFIRMATION_TIMEOUT_MS
    )
      .then(() => true)
      .catch(() => false)

    const response = { type: "OAUTH_SUCCESS", data: { code } }
    channel.postMessage(response)

    isMessageConfirmed.then((isReceived) => {
      if (isReceived) {
        channel.close()
        window.close()
      } else {
        localStorage.setItem(`EMAIL_shouldConnect`, JSON.stringify(response))
        router.push(from)
      }
    })
  }

  const submit = handleSubmit((formValues) => {
    if (!!formValues.code) {
      return sendCodeBackToMainWindow(formValues.code)
    }
    return onSubmitVerificationRequest(formValues.email)
  })

  const shouldShowPinEntry = !!verificationRequestResponse

  return (
    <Center height={"100vh"}>
      <Card p={10}>
        <VStack spacing={7} as="form" onSubmit={submit}>
          <FormControl isDisabled={!!shouldShowPinEntry}>
            <FormLabel>E-Mail address</FormLabel>
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

          <FormControl isDisabled={!shouldShowPinEntry}>
            <FormLabel>Verification code</FormLabel>
            <HStack>
              <PinInput
                isDisabled={!shouldShowPinEntry}
                value={field.value}
                onChange={(value) => field.onChange(value)}
              >
                <PinInputField autoFocus />
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
              </PinInput>
            </HStack>
          </FormControl>

          <HStack w={"full"} justifyContent="end" spacing={4}>
            {shouldShowPinEntry && (
              <Button
                variant="link"
                opacity={0.75}
                size="sm"
                onClick={() => {
                  setValue("code", "")
                  resetVerificationRequest()
                }}
              >
                Use different email
              </Button>
            )}
            <Button
              isLoading={isVerificationRequestLoading}
              colorScheme="green"
              type={"submit"}
              isDisabled={shouldShowPinEntry && code.length !== PIN_LENGTH}
            >
              {shouldShowPinEntry ? "Submit" : "Send PIN"}
            </Button>
          </HStack>
        </VStack>
      </Card>
    </Center>
  )
}

export default EmailVerificationPage
