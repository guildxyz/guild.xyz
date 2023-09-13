import {
  Center,
  Flex,
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
import { useController, useForm } from "react-hook-form"
import { useFetcherWithSignWithKeyPairOfUser } from "utils/fetcher"
import timeoutPromise from "utils/timeoutPromise"
import { OAUTH_CONFIRMATION_TIMEOUT_MS } from "./oauth"

const EmailVerificationPage = () => {
  const router = useRouter()
  const address = router?.query?.address?.toString()
  const fetcherWithSign = useFetcherWithSignWithKeyPairOfUser(address)

  const { register, handleSubmit, control } = useForm<{
    email: string
    code: string
  }>({
    defaultValues: { email: "", code: "" },
  })
  const { field } = useController({ control, name: "code" })

  const dummySubmitVerificationRequest = async () => {
    const profile = await fetcherWithSign([
      `/v2/users/${address}/profile`,
      { method: "GET" },
    ])

    console.log("Sign PoC:", { profile })

    const code = new Uint8Array(6)
    self.crypto.getRandomValues(code)

    return {
      code: [...code].map((byte) => Math.floor((byte / 256) * 10)),
    }
  }

  const {
    onSubmit: onSubmitVerificationRequest,
    isLoading: isVerificationRequestLoading,
    response: verificationRequestResponse,
  } = useSubmit(dummySubmitVerificationRequest, {
    onSuccess: (resp) => console.log("resp", resp),
  })

  const submitVerificationRequest = handleSubmit((formValues) => {
    console.log("TODO: Send request with email:", formValues.email)
    onSubmitVerificationRequest()
  })

  const { from, csrfToken } =
    typeof window === "undefined"
      ? { from: null, csrfToken: null }
      : JSON.parse(window.localStorage.getItem(`EMAIL_oauthinfo`) ?? "{}")

  const submitCode = handleSubmit((formValues) => {
    console.log({ formValues })
    const channel = new BroadcastChannel(csrfToken)

    const isMessageConfirmed = timeoutPromise(
      new Promise<void>((resolve) => {
        channel.onmessage = () => resolve()
      }),
      OAUTH_CONFIRMATION_TIMEOUT_MS
    )
      .then(() => true)
      .catch(() => false)

    const response = { type: "OAUTH_SUCCESS", data: { code: formValues.code } }
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
  })

  const shouldShowPinEntry = !!verificationRequestResponse

  return (
    <Center height={"100vh"}>
      <Card p={10}>
        {shouldShowPinEntry ? (
          <VStack spacing={7} as="form" onSubmit={submitCode}>
            <FormControl>
              <FormLabel>Verification code</FormLabel>
              <HStack>
                <PinInput
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                >
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                </PinInput>
              </HStack>
            </FormControl>
            <Flex w={"full"} justifyContent="end">
              <Button colorScheme="green" type={"submit"}>
                Submit
              </Button>
            </Flex>
          </VStack>
        ) : (
          <VStack spacing={7} as="form" onSubmit={submitVerificationRequest}>
            <FormControl>
              <FormLabel>E-Mail address</FormLabel>
              <Input
                type="email"
                {...register("email", {
                  required: true,
                  // We should get native validation
                  // pattern: { value: EMAIL_REGEX, message: "Invalid E-Mail address" },
                })}
              />
            </FormControl>

            <Flex w={"full"} justifyContent="end">
              <Button
                isLoading={isVerificationRequestLoading}
                colorScheme="green"
                type={"submit"}
              >
                Submit
              </Button>
            </Flex>
          </VStack>
        )}
      </Card>
    </Center>
  )
}

export default EmailVerificationPage
