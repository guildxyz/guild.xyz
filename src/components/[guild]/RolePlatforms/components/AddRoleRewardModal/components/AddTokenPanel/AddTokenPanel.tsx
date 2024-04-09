import {
  Box,
  Collapse,
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
import { Chain } from "@guildxyz/types"
import { AddRewardPanelProps } from "platforms/rewards"
import { FormProvider, useForm } from "react-hook-form"
import { PlatformType } from "types"
import PoolStep from "./components/PoolStep"
import SetTokenStep from "./components/SetTokenStep"
import TokenAmountStep from "./components/TokenAmountStep"

export type AddTokenFormType = {
  poolId: number
  multiplier: number
  addition: number
  chain: Chain
  contractAddress: `0x${string}`
  name: string
  description: string
  imageUrl: string
  tokenDecimals: number
  data: {
    guildPlatformId: number
  }
}

const AddTokenPanel = ({ onAdd }: AddRewardPanelProps) => {
  const methods = useForm<AddTokenFormType>({
    mode: "all",
    defaultValues: {
      addition: 1,
    },
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

  const onSubmit = (_data) => {
    onAdd({
      guildPlatform: {
        platformId: PlatformType.ERC20,
        platformName: "ERC20",
        platformGuildId: `${_data.chain}-${_data.poolId}-${Date.now()}`,
        platformGuildData: {
          poolId: _data.poolId,
          chain: _data.chain,
          contractAddress: _data.contractAddress,
          name: _data.name,
          description: "",
          imageUrl: _data.imageUrl ?? `/guildLogos/132.svg`,
          tokenDecimals: _data.tokenDecimals,
        },
      },

      // TODO: make live when backend is ready

      // dynamicAmount: {
      //   operation: {
      //     type: "LINEAR",
      //     params: {
      //       addition: _data.addition,
      //       multiplier: _data.multiplier,
      //     },
      //     input: {
      //       type: "STATIC"
      //     },
      //   },
      // },
      isNew: true,
    })
  }

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
              <Collapse in={activeStep === index} animateOpacity>
                <step.content
                  onContinue={goToNext}
                  onSubmit={methods.handleSubmit(onSubmit)}
                />
              </Collapse>
            </Box>

            <StepSeparator />
          </Step>
        ))}
      </Stepper>
    </FormProvider>
  )
}

export default AddTokenPanel
