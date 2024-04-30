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
import { Schemas } from "@guildxyz/types"
import { useTokenRewards } from "components/[guild]/AccessHub/hooks/useTokenRewards"
import { useAddRewardDiscardAlert } from "components/[guild]/AddRewardButton/hooks/useAddRewardDiscardAlert"
import { AddRewardPanelProps } from "platforms/rewards"
import { FormProvider, useForm } from "react-hook-form"
import { PlatformGuildData, PlatformType, Requirement } from "types"
import { ERC20_CONTRACTS } from "utils/guildCheckout/constants"
import { Chain } from "wagmiConfig/chains"
import PoolStep from "./components/PoolStep"
import SetTokenStep from "./components/SetTokenStep"
import TokenAmountStep from "./components/TokenAmountStep"

export enum TokenRewardType {
  DYNAMIC_SNAPSHOT = "DYNAMIC_SNAPSHOT",
  DYNAMIC_POINTS = "DYNAMIC_POINTS",
  STATIC = "STATIC",
}

export type AddTokenFormType = {
  poolId: number
  multiplier: number
  addition: number
  chain: Chain
  contractAddress: `0x${string}`
  tokenAddress: `0x${string}`
  name: string
  description: string
  imageUrl: string
  data: {
    guildPlatformId: number
  }
  snapshotId: number
  type: TokenRewardType
  staticValue?: number
  requirements?: Requirement[]
}

const AddTokenPanel = ({ onAdd }: AddRewardPanelProps) => {
  const methods = useForm<AddTokenFormType>({
    mode: "all",
    defaultValues: {
      addition: 0,
      multiplier: 1,
      type: TokenRewardType.DYNAMIC_SNAPSHOT,
    },
  })
  useAddRewardDiscardAlert(methods.formState.isDirty)

  const steps = [
    { title: "Set token", content: SetTokenStep },
    { title: "Set claimable amount", content: TokenAmountStep },
    { title: "Fund reward pool", content: PoolStep },
  ]

  const { activeStep, goToNext, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  })

  const accessedTokens = useTokenRewards()

  const constructSubmitData = (_data) => {
    const platform = accessedTokens.find(
      (guildPlatform) =>
        guildPlatform.platformId === PlatformType.ERC20 &&
        guildPlatform.platformGuildData.chain === _data.chain &&
        guildPlatform.platformGuildData.tokenAddress.toLowerCase() ===
          _data.tokenAddress?.toLowerCase()
    )

    const dynamicAmount = {
      ...(_data.type === TokenRewardType.DYNAMIC_SNAPSHOT && {
        operation: {
          type: "LINEAR",
          params: {
            addition: _data.addition,
            multiplier: _data.multiplier,
          },
          input: {
            type: "REQUIREMENT_AMOUNT",
            // Will be filled after role creation
          },
        },
      }),

      ...(_data.type === TokenRewardType.STATIC && {
        operation: {
          type: "LINEAR",
          input: {
            type: "STATIC",
            value: _data.staticValue,
          },
        },
      }),
    } satisfies Schemas["DynamicAmount"]

    const rolePlatformPart = {
      dynamicAmount: dynamicAmount,
      platformRoleData: { pointGuildPlatformId: _data.data.guildPlatformId },
      isNew: true,
    }

    const guildPlatformPart = {
      ...(platform && { guildPlatformId: platform.id }),
      guildPlatform: {
        platformId: PlatformType.ERC20,
        platformName: "ERC20" as const,
        platformGuildId: `${_data.chain}-${_data.poolId}-${Date.now()}`,
        platformGuildData: {
          poolId: _data.poolId,
          chain: _data.chain,
          tokenAddress: _data.tokenAddress,
          contractAddress: ERC20_CONTRACTS[_data.chain],
          name: _data.name,
          description: "",
          imageUrl: _data.imageUrl ?? `/guildLogos/132.svg`,
        } as PlatformGuildData["ERC20"],
      },
    }

    return {
      ...guildPlatformPart,
      ...(_data.type !== TokenRewardType.STATIC && {
        requirements: _data.requirements,
      }),
      ...rolePlatformPart,
    }
  }

  const onSubmit = (_data) => {
    onAdd(constructSubmitData(_data))
  }

  return (
    <FormProvider {...methods}>
      <Stepper
        colorScheme="indigo"
        index={activeStep}
        orientation="vertical"
        gap="0"
        w="full"
        height="100%"
      >
        {steps.map((step, index) => (
          <Step
            key={index}
            style={{ width: "100%", height: "100%" }}
            onClick={activeStep > index ? () => setActiveStep(index) : null}
          >
            <StepIndicator>
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
                in={activeStep === index}
                animateOpacity
                style={{ padding: "2px", margin: "-2px" }}
              >
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
