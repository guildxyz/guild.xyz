import { Heading, Stack, Text, useBreakpointValue } from "@chakra-ui/react"
import { Step, Steps } from "chakra-ui-steps"
import SimpleLayout from "components/common/Layout/SimpleLayout"
import {
  CreateGuildProvider,
  useCreateGuildContext,
} from "components/create-guild/CreateGuildContext"

const CreateGuildPage = (): JSX.Element => {
  const { steps, activeStep } = useCreateGuildContext()
  const stepsOrientatiom = useBreakpointValue<"horizontal" | "vertical">({
    base: "vertical",
    md: "horizontal",
  })

  return (
    <SimpleLayout title={steps[activeStep].label}>
      <Steps
        activeStep={activeStep}
        colorScheme="indigo"
        textAlign="left"
        orientation={stepsOrientatiom}
      >
        {steps.map((step) => (
          <Step key={step.label} label={step.label} description={step.description}>
            <Stack w="full" spacing={{ base: 4, md: 10 }}>
              <Stack w="full" alignItems="start">
                <Heading
                  as="h1"
                  fontSize={{ md: "4xl", lg: "5xl" }}
                  fontFamily="display"
                  wordBreak="break-word"
                  display={{ base: "none", md: "block" }}
                >
                  {step.title}
                </Heading>

                {step.subtitle && (
                  <Text
                    colorScheme="gray"
                    fontSize="lg"
                    fontWeight="semibold"
                    mt="-8"
                    mb="10"
                  >
                    {step.subtitle}
                  </Text>
                )}
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
