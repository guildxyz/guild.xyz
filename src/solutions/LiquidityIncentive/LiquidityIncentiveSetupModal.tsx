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
import { Chain } from "@guildxyz/types"
import { Modal } from "components/common/Modal"
import { ArrowLeft } from "phosphor-react"
import { FormProvider, useForm } from "react-hook-form"
import SelectLiquidityPoolStep from "./components/SelectLiquidityPoolStep"
import SetPointsReward from "./components/SetPointsRewardStep"

type LiquidityIncentiveForm = {
  conversion: number
  pointsId?: number // if points reward is selected
  imageUrl?: string // if points reward is created
  name?: string // if points reawrd is created
  pool: {
    data: {
      lpVault: `0x${string}` // pool address
    }
    chain: Chain
  }
  amount: number
}

const LiquidityIncentiveSetupModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) => {
  const steps = [
    { title: "Select liquidity pool", content: SelectLiquidityPoolStep },
    { title: "Set points reward", content: SetPointsReward },
  ]

  const { activeStep, goToNext, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  })

  const defaultValues = {
    conversion: 1,
    pool: {
      data: {
        lpVault: "",
      },
    },
    name: null,
    imageUrl: null,
  }

  const methods = useForm<LiquidityIncentiveForm>({
    mode: "all",
    // @ts-ignore
    defaultValues,
  })

  const handleClose = () => {
    onClose()

    // @ts-ignore
    methods.reset(defaultValues)
    setActiveStep(0)
  }

  const submit = (data) => {
    console.log(data)
  }

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
                          onSubmit={methods.handleSubmit(submit)}
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
