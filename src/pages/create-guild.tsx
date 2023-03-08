import { Stack, useBreakpointValue } from "@chakra-ui/react"
import { Step } from "chakra-ui-steps"
import DynamicSteps from "components/common/DynamicSteps"
import SimpleLayout from "components/common/Layout/SimpleLayout"
import {
  CreateGuildProvider,
  useCreateGuildContext,
} from "components/create-guild/CreateGuildContext"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
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

  return (
    <>
      <SimpleLayout title="Create Guild">
        <DynamicSteps
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
        </DynamicSteps>
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
