import {
  Center,
  Collapse,
  Icon,
  Stack,
  Step,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  StepperProps,
  Text,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import SummonMembers from "components/[guild]/Onboarding/components/SummonMembers"
import Card from "components/common/Card"
import { CaretDown } from "phosphor-react"
import { Fragment } from "react"
import BasicInfo from "./BasicInfo"
import ChooseTemplate from "./ChooseTemplate"
import CreateGuildIndex from "./CreateGuildIndex"

export const STEPS: {
  title: string
  label?: string[] | JSX.Element[]
  description?: string[]
  content?: JSX.Element
  progress?: number[]
}[] = [
  {
    title: "Set rewards",
    label: [
      "Connect platforms below that you build your community around. We’ll generate templates for your guild based on this",
    ],
    content: <CreateGuildIndex />,
    progress: [0],
  },
  {
    title: "Customize guild",
    label: [<BasicInfo key={0} />],
    progress: [25],
  },
  {
    title: "Choose template",
    description: ["1/2", "2/2"],
    label: [
      <Text key={0}>
        Your guild consists of
        <Text as="b" fontWeight={"semibold"}>
          {` roles `}
        </Text>
        that the members can satisfy the
        <Text as="b" fontWeight={"semibold"}>
          {` requirements `}
        </Text>
        of to gain access to their
        <Text as="b" fontWeight={"semibold"}>
          {` rewards`}
        </Text>
        . Choose some defaults to get you started!
      </Text>,
      <Text key={1}>Choose rewards for the selected roles!</Text>,
    ],
    content: <ChooseTemplate />,
    progress: [50, 66],
  },
  {
    title: "Edit roles",
    label: [
      "Your guild is created, and you’re already in! Edit & add roles as you want",
    ],
  },
  {
    title: "Finish",
    label: [<SummonMembers key={0} />],
  },
]

const CreateGuildStepper = ({
  color,
  textColor,
  activeStep,
  stepPart,
  setActiveStep,
  enableGoingBack = true,
  ...rest
}) => {
  const { isOpen, onToggle } = useDisclosure()

  const cardBgColor = useColorModeValue("gray.50", "blackAlpha.300")
  const orientation = useBreakpointValue<StepperProps["orientation"]>({
    base: "vertical",
    md: "horizontal",
  })
  const StepWrapperComponent = useBreakpointValue({
    base: Collapse,
    md: Fragment,
  })
  const shouldPassCollapseProps = useBreakpointValue({
    base: true,
    md: false,
  })

  return (
    <Card
      data-test="create-guild-stepper"
      pos="relative"
      py="6"
      px={{ base: 5, md: 6 }}
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        bg: cardBgColor,
      }}
      borderWidth="2px"
      borderColor={color}
      {...rest}
    >
      <Stepper
        index={activeStep}
        orientation={orientation}
        gap={{ base: 0, md: 2 }}
        w="full"
        size={"sm"}
      >
        {STEPS.map((step, index) => (
          <StepWrapperComponent
            key={index}
            {...(shouldPassCollapseProps
              ? {
                  in: activeStep === index || isOpen,
                  style: {
                    width: "100%",
                  },
                  onClick: activeStep === index ? onToggle : undefined,
                }
              : undefined)}
          >
            <Step
              onClick={() => {
                if (enableGoingBack && activeStep > index) {
                  setActiveStep(index)
                }
              }}
              {...{
                cursor:
                  activeStep === index || (enableGoingBack && activeStep > index)
                    ? "pointer"
                    : "not-allowed",
                alignItems: "center",
              }}
            >
              <StepIndicator
                {...{
                  bg: activeStep > index ? `${color} !important` : undefined,
                  borderColor: activeStep === index ? `${color} !important` : "none",
                }}
              >
                <StepStatus
                  complete={<StepIcon color={textColor} />}
                  incomplete={<StepNumber />}
                  active={<StepNumber />}
                />
              </StepIndicator>
              <Stack
                justifyContent={"center"}
                spacing="0"
                w={{ base: "full", md: "auto" }}
                position={"relative"}
              >
                <StepTitle as={"p"} style={{ fontSize: "xs" }}>
                  {step.title}
                </StepTitle>
                {activeStep === index && (
                  <Text colorScheme="gray" fontSize="sm" left={0} bottom={-5}>
                    {step.description?.[stepPart]}
                  </Text>
                )}
              </Stack>
              {activeStep === index && (
                <Center display={{ md: "none" }}>
                  <Icon
                    as={CaretDown}
                    boxSize={4}
                    transform={isOpen && "rotate(-180deg)"}
                    transition="transform .3s"
                  />
                </Center>
              )}
            </Step>

            <StepSeparator
              {...({
                position: "relative !important",
                top: "unset !important",
                left: "unset !important",
                marginLeft: 4,
                minHeight: { base: !isOpen ? 0 : 4, md: "2px" },
                height: {
                  base: !isOpen ? 0 : "4 !important",
                  md: "2px !important",
                },
                transition: ".2s ease",
              } as any)}
            />
          </StepWrapperComponent>
        ))}
      </Stepper>
      {STEPS[activeStep].label && (
        <Text pt={7} position={"relative"}>
          {STEPS[activeStep].label?.[stepPart]}
        </Text>
      )}
    </Card>
  )
}

export default CreateGuildStepper
