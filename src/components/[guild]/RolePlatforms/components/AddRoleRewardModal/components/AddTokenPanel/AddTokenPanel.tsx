import {
  Box,
  Step,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
} from "@chakra-ui/react"
import { AddRewardPanelProps } from "platforms/rewards"
import { FormProvider, useForm } from "react-hook-form"
import PoolStep from "./components/PoolStep"
import SetTokenStep from "./components/SetTokenStep"
import TokenAmountStep from "./components/TokenAmountStep"

export type AddGatherFormType = {
  gatherApiKey: string
  gatherSpaceId: string
  gatherRole: string
  gatherAffiliation: string
}

const AddTokenPanel = ({ onAdd }: AddRewardPanelProps) => {
  const methods = useForm<AddGatherFormType>({
    mode: "all",
  })

  const steps = [
    { title: "Set token", content: SetTokenStep },
    { title: "Set claimable amount", content: TokenAmountStep },
    { title: "Fund reward pool", content: PoolStep },
  ]

  const { activeStep, goToNext, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  })

  const color = "primary.500"

  return (
    <FormProvider {...methods}>
      <Stepper
        colorScheme={"indigo"}
        index={activeStep}
        orientation="vertical"
        gap="0"
        w="full"
      >
        {steps.map((step, index) => (
          <Step
            key={index}
            style={{ width: "100%" }}
            onClick={activeStep > index ? () => setActiveStep(index) : null}
          >
            <StepIndicator
              {...{
                bg: activeStep > index ? `${color} !important` : undefined,
                borderColor: activeStep === index ? `${color} !important` : "none",
              }}
            >
              <StepStatus
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
              />
            </StepIndicator>

            <Box
              w="full"
              mt={1}
              minH={index === steps.length - 1 ? 0 : 12}
              _hover={activeStep > index && { cursor: "pointer" }}
            >
              <StepTitle>{step.title}</StepTitle>
              {activeStep === index && <step.content onContinue={goToNext} />}
            </Box>

            <StepSeparator />
          </Step>
        ))}
      </Stepper>
    </FormProvider>
  )
}

export default AddTokenPanel
