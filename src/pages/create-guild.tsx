import { Stack, useBreakpointValue, useColorMode } from "@chakra-ui/react"
import { Step, Steps } from "chakra-ui-steps"
import SimpleLayout from "components/common/Layout/SimpleLayout"
import {
  CreateGuildProvider,
  useCreateGuildContext,
} from "components/create-guild/CreateGuildContext"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import { useEffect } from "react"
import { useFormContext } from "react-hook-form"

const CreateGuildPage = (): JSX.Element => {
  const { steps, activeStep } = useCreateGuildContext()
  const { control } = useFormContext()

  const stepsOrientatiom = useBreakpointValue<"horizontal" | "vertical">(
    {
      base: "vertical",
      md: "horizontal",
    },
    "horizontal"
  )

  const { setColorMode } = useColorMode()

  useEffect(() => {
    setColorMode("dark")
  }, [])

  return (
    <>
      <SimpleLayout title="Create Guild">
        <Steps
          activeStep={activeStep}
          colorScheme="indigo"
          textAlign="left"
          orientation={stepsOrientatiom}
        >
          {steps.map((step) => (
            <Step key={step.label} label={step.label} description={step.description}>
              <Stack w="full" spacing={{ base: 4, md: 10 }}>
                {step.content}
              </Stack>
            </Step>
          ))}
        </Steps>
      </SimpleLayout>
      <DynamicDevTool control={control} />
    </>
  )
}

const CreateGuildPageWrapper = (): JSX.Element => (
  <CreateGuildProvider>
    <CreateGuildPage />
  </CreateGuildProvider>
)

export default CreateGuildPageWrapper
