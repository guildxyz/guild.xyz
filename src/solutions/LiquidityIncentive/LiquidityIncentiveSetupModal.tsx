import {
  Box,
  Collapse,
  HStack,
  IconButton,
  Input,
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
import { FormProvider, useForm, useWatch } from "react-hook-form"
import SelectLiquidityPoolStep from "./components/SelectLiquidityPoolStep"

const LiquidityIncentiveSetupModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) => {
  const steps = [
    { title: "Select liquidity pool", content: SelectLiquidityPoolStep },
    { title: "Set points reward", content: Box },
  ]

  const { activeStep, goToNext, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  })

  const methods = useForm<any>({
    mode: "all",
    defaultValues: {},
  })

  const wat = useWatch({ name: "wat", control: methods.control })
  console.log(wat)

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
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

              <Input {...methods.register("wat")} />

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
                        <step.content onContinue={goToNext} onSubmit={null} />
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
