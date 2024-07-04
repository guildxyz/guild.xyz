import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Collapse,
  HStack,
  Icon,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
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
  chakra,
  useColorModeValue,
  useSteps,
} from "@chakra-ui/react"
import { ArrowLeft, Info } from "@phosphor-icons/react"
import useMembershipUpdate from "components/[guild]/JoinModal/hooks/useMembershipUpdate"
import { triggerChat } from "components/_app/IntercomProvider"
import { FormProvider, useForm } from "react-hook-form"
import { UniswapChains } from "requirements/Uniswap/hooks/useParsePoolChain"
import SelectLiquidityPoolStep from "./components/SelectLiquidityPoolStep"
import SetPointsReward from "./components/SetPointsRewardStep"
import useCreateLiquidityIncentive from "./hooks/useCreateLiquidityIncentive"

export type LiquidityIncentiveForm = {
  conversion: number
  pointsId?: number | null // if points reward is selected
  imageUrl?: string // if points reward is created
  name?: string // if points reawrd is created
  pool: {
    /**
     * TODO: figure out better typing solution form resetting needs to allow for
     * nulls
     */
    data: {
      lpVault: `0x${string}` | null // pool address
      baseCurrency: "token0" | "token1"
      minAmount: number
      token0: `0x${string}` | null
      token1: `0x${string}` | null
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

const steps = [
  { title: "Choose your liquidity pool", content: SelectLiquidityPoolStep },
  { title: "Set points reward", content: SetPointsReward },
]

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

  const { triggerMembershipUpdate } = useMembershipUpdate()

  const { onSubmit, isLoading } = useCreateLiquidityIncentive(() => {
    triggerMembershipUpdate()
    handleClose()
  })

  const { activeStep, goToNext, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  })

  const footerBg = useColorModeValue("blackAlpha.100", "blackAlpha.600")

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
                Create a point-based incentive for liquidity providers. More
                liquidity means more points. Set a custom conversion rate to
                fine-tune the rewards.
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
                          isLoading={isLoading}
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
          <ModalFooter pt={6} pb={6} bg={footerBg} border={"none"}>
            <Accordion allowToggle w="full">
              <AccordionItem border={"none"}>
                <AccordionButton
                  display={"flex"}
                  rounded={"lg"}
                  fontWeight={"semibold"}
                  px={0}
                  opacity={0.5}
                  _hover={{ opacity: 1 }}
                >
                  <Icon as={Info} mr={2} />
                  This solution uses Uniswap v3
                  <AccordionIcon ml={"auto"} />
                </AccordionButton>
                <AccordionPanel>
                  <Text color={"GrayText"}>
                    Please note that our liquidity incentive setup flow currently
                    supports only Uniswap V3. If you require assistance with other
                    liquidity protocols or platforms, please{" "}
                    <chakra.span
                      textDecoration={"underline"}
                      _hover={{ cursor: "pointer" }}
                      onClick={() => triggerChat()}
                    >
                      contact our support team
                    </chakra.span>{" "}
                    for further assistance.
                  </Text>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default LiquidityIncentiveSetupModal
