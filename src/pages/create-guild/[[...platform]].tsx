import { Heading, Stack, Text } from "@chakra-ui/react"
import { Step, Steps } from "chakra-ui-steps"
import SimpleLayout from "components/common/Layout/SimpleLayout"
import {
  CreateGuildProvider,
  useCreateGuildContext,
} from "components/create-guild/CreateGuildContext"
import useIsConnected from "hooks/useIsConnected"
import { useRouter } from "next/router"
import { useEffect } from "react"

const CreateGuildPage = (): JSX.Element => {
  const { platform, steps, activeStep } = useCreateGuildContext()
  const router = useRouter()

  const isConnected = useIsConnected(platform)

  useEffect(() => {
    if (platform && !isConnected) {
      router.push("/create-guild")
    }
  }, [platform, isConnected])

  return (
    <SimpleLayout title={steps[activeStep].label}>
      <Steps activeStep={activeStep} colorScheme="indigo" textAlign="left">
        {steps.map((step) => (
          <Step key={step.label} label={step.label}>
            <Stack w="full" spacing={10}>
              <Stack w="full" alignItems="start">
                <Heading
                  as="h1"
                  fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                  fontFamily="display"
                  wordBreak="break-word"
                >
                  {step.label}
                </Heading>

                <Text
                  colorScheme="gray"
                  fontSize="lg"
                  fontWeight="semibold"
                  mt="-8"
                  mb="10"
                >
                  {step.description}
                </Text>
              </Stack>

              {step.content && <step.content />}
            </Stack>
          </Step>
        ))}
      </Steps>
    </SimpleLayout>
  )
}

const CreateGuildPageWrapper = (): JSX.Element => (
  <CreateGuildProvider>
    <CreateGuildPage />
  </CreateGuildProvider>
)

export default CreateGuildPageWrapper
