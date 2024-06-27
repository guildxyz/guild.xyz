import {
  Box,
  Collapse,
  HStack,
  IconButton,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Step,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  Text,
  useSteps,
} from "@chakra-ui/react"
import { Modal } from "components/common/Modal"
import { ArrowLeft } from "phosphor-react"
import { FormProvider, useForm } from "react-hook-form"
import { UniswapChains } from "requirements/Uniswap/hooks/useParsePoolTokenId"
import SelectLiquidityPoolStep from "./components/SelectLiquidityPoolStep"
import SetPointsReward from "./components/SetPointsRewardStep"
import useCreateLiquidityIncentive from "./hooks/useCreateLiquidityIncentive"

export type LiquidityIncentiveForm = {
  conversion: number
  pointsId?: number | null // if points reward is selected
  imageUrl?: string // if points reward is created
  name?: string // if points reawrd is created
  pool: {
    data: {
      lpVault: `0x${string}` | null // pool address
      baseCurrency: string
      minAmount: number
      token0?: `0x${string}` | null
      token1?: `0x${string}` | null
      defaultFee: number
      countedPositions: string
    }
    chain: UniswapChains
  }
}

const uniswapReqDefaults = {
  lpVault: null,
  baseCurrency: "token0",
  countedPositions: "FULL_RANGE",
  minAmount: 0,
  defaultFee: 0,
  token0: null,
  token1: null,
} satisfies LiquidityIncentiveForm["pool"]["data"]

const defaultValues = {
  conversion: 1,
  pool: {
    data: {
      ...uniswapReqDefaults,
    },
  },
  name: "",
  imageUrl: "",
  pointsId: null,
}

const LiquidityIncentiveSetupModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) => {
  const methods = useForm<LiquidityIncentiveForm>({
    mode: "all",
    defaultValues,
  })

  const handleClose = () => {
    onClose()
    methods.reset(defaultValues)
    setActiveStep(0)
  }

  const { onSubmit } = useCreateLiquidityIncentive(handleClose)

  const steps = [
    { title: "Select liquidity pool", content: SelectLiquidityPoolStep },
    { title: "Set points reward", content: SetPointsReward },
  ]

  const { activeStep, goToNext, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  })

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        size="xl"
        scrollBehavior="inside"
        colorScheme="dark"
      >
        <ModalOverlay />

        <ModalContent>
          <FormProvider {...methods}>
            <ModalCloseButton />

            <ModalHeader>
              <HStack>
                <IconButton
                  rounded="full"
                  aria-label="Back"
                  size="sm"
                  mb="-3px"
                  icon={<ArrowLeft size={20} />}
                  variant="ghost"
                  onClick={onClose}
                />
                <Text>Liquidity incentive program</Text>
              </HStack>
            </ModalHeader>

            <ModalBody className="custom-scrollbar">
              <Text colorScheme="gray" fontWeight="semibold" mb="8">
                Set up point-based incentive for liquidity providers. The more
                liquidity a user provides, the more points they receive! Set a custom
                converision rate to fine-tune your incentive program.
              </Text>

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
                    onClick={
                      activeStep > index ? () => setActiveStep(index) : undefined
                    }
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
                      _hover={activeStep > index ? { cursor: "pointer" } : undefined}
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
            </ModalBody>
          </FormProvider>
        </ModalContent>
      </Modal>
    </>
  )
}

export default LiquidityIncentiveSetupModal
