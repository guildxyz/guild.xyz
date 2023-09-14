import {
  Center,
  FormControl,
  HStack,
  Input,
  PinInput,
  PinInputField,
  Text,
  VStack,
} from "@chakra-ui/react"
import { Step, Steps } from "chakra-ui-steps"
import Button from "components/common/Button"
import Card from "components/common/Card"
import useSubmit from "hooks/useSubmit"
import { useRouter } from "next/router"
import { useState } from "react"
import { useController, useForm, useWatch } from "react-hook-form"
import { useFetcherWithSignWithKeyPairOfUser } from "utils/fetcher"
import timeoutPromise from "utils/timeoutPromise"
import { OAUTH_CONFIRMATION_TIMEOUT_MS } from "./oauth"

const PIN_LENGTH = 6

const steps = {
  EMAIL_ENTRY: 0,
  PIN_ENTRY: 1,
}

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
  const email = useWatch({ control, name: "email" })

  const [activeStep, setActiveStep] = useState(steps.EMAIL_ENTRY)

  const submitVerificationRequest = async (emailAddress: string) => {
    setActiveStep(steps.PIN_ENTRY)
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

  const sendCodeBackToMainWindow = (pin: string) => {
    const channel = new BroadcastChannel(csrfToken)

    const isMessageConfirmed = timeoutPromise(
      new Promise<void>((resolve) => {
        channel.onmessage = () => resolve()
      }),
      OAUTH_CONFIRMATION_TIMEOUT_MS
    )
      .then(() => true)
      .catch(() => false)

    const response = { type: "OAUTH_SUCCESS", data: { code: pin } }
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
      <Card p={10} minW={500}>
        <Steps
          // onClickStep={setActiveStep}
          activeStep={activeStep}
          colorScheme="primary"
          orientation={"vertical"}
          size="sm"
        >
          <Step
            label={
              activeStep === steps.PIN_ENTRY ? (
                <HStack spacing={6}>
                  <Text>{email}</Text>
                  <Button
                    variant="link"
                    opacity={0.75}
                    size="xs"
                    onClick={() => {
                      setValue("code", "")
                      resetVerificationRequest()
                      setActiveStep(steps.EMAIL_ENTRY)
                    }}
                  >
                    use different email
                  </Button>
                </HStack>
              ) : (
                "Enter E-Mail address"
              )
            }
            key={"email-entry"}
          >
            <FormControl>
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
          </Step>
          <Step label={"Enter PIN"} key={"pin-entry"}>
            <FormControl>
              <HStack justifyContent={"center"}>
                <PinInput
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
          </Step>
        </Steps>

        <VStack spacing={7} as="form" onSubmit={submit} mt={8}>
          <HStack w={"full"} justifyContent="end">
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
