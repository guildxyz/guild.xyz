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
import useGuild from "components/[guild]/hooks/useGuild"
import { AddRewardPanelProps } from "platforms/rewards"
import { useState } from "react"
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
  const { id: guildId } = useGuild()
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

  const [isCollapsed, setIsCollapsed] = useState(false)

  const collapseAndExecute = (callback: () => void) => {
    setIsCollapsed(true)
    setTimeout(() => {
      callback()
      setTimeout(() => setIsCollapsed(false), 100)
    }, 250)
  }

  const onSubmit = (_data) => {
    onAdd({
      guildPlatform: {
        platformId: PlatformType.ERC20,
        platformName: "ERC20",
        // TODO: ez itt mi legyen pontosan?
        platformGuildId: `${_data.chain}-${Date.now()}`,
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
      dynamicAmount: {
        operation: {
          type: "LINEAR",
          params: {
            addition: _data.addition,
            multiplier: _data.multiplier,
          },
          input: {
            type: "ERC20",
            guildPlatformId: PlatformType.ERC20,
            guildId: guildId,
          },
        },
      },
      isNew: true,
    })
  }

  const stepTo = (index: number) =>
    activeStep > index && collapseAndExecute(() => setActiveStep(index))

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
          <Step key={index} style={{ width: "100%" }} onClick={() => stepTo(index)}>
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
              <Collapse
                in={!isCollapsed}
                animateOpacity
                transition={{ enter: { duration: 0.25 }, exit: { duration: 0.25 } }}
              >
                {activeStep === index && (
                  <step.content
                    onContinue={() => collapseAndExecute(goToNext)}
                    onSubmit={methods.handleSubmit(onSubmit)}
                  />
                )}
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
