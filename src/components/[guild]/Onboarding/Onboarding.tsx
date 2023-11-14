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
  Text,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import { CaretDown } from "phosphor-react"
import React from "react"
import { useThemeContext } from "../ThemeContext"
import useGuild from "../hooks/useGuild"
import { useOnboardingContext } from "./components/OnboardingProvider"
import SummonMembers from "./components/SummonMembers"

type Props = {
  activeStep: number
  prevStep: () => void
  nextStep: () => void
}

const steps = [
  {
    title: "Set platforms",
  },
  {
    title: "Customize guild",
  },
  {
    title: "Choose template",
  },
  {
    title: "Edit roles",
    note: (
      <Text colorScheme="gray" mt={8}>
        Your guild is created, and you’re already in! Edit & add roles as you want
      </Text>
    ),
  },
  {
    title: "Finish",
    note: <SummonMembers activeStep={3} />,
  },
]

const Onboarding = (): JSX.Element => {
  const { onboardingComplete } = useGuild()
  const { localThemeColor, textColor } = useThemeContext()
  const bannerColor = useColorModeValue("gray.200", "gray.700")
  const { localStep } = useOnboardingContext()
  const isMobile = useBreakpointValue({ base: true, md: false })

  const { isOpen, onToggle } = useDisclosure()
  const WrapperComponent = useBreakpointValue<any>({
    base: Collapse,
    md: React.Fragment,
  })

  const orientation = useBreakpointValue<"vertical" | "horizontal">({
    base: "vertical",
    md: "horizontal",
  })
  const isDarkMode = useColorModeValue(false, true)

  return (
    <Collapse in={!onboardingComplete} unmountOnExit>
      <Card
        borderColor={localThemeColor}
        borderWidth={3}
        p={{ base: 4, sm: 6 }}
        mb="8"
        pos="relative"
        _before={
          isDarkMode && {
            content: `""`,
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            bg: "blackAlpha.300",
            zIndex: 0,
          }
        }
        sx={{ "*": { zIndex: 1 } }}
        onClick={onToggle}
      >
        <Stepper
          index={localStep}
          orientation={orientation}
          gap={{ base: 0, md: 4 }}
          w="full"
          size={"sm"}
        >
          {steps.map((step, index) => (
            <WrapperComponent
              key={index}
              in={localStep === index || isOpen}
              style={{ width: "100%" }}
            >
              <Step
                {...{
                  gap: 3,
                }}
              >
                <StepIndicator
                  {...{
                    bg:
                      localStep > index
                        ? `${localThemeColor} !important`
                        : bannerColor,
                    borderColor:
                      localStep === index ? `${localThemeColor} !important` : "none",
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
                >
                  <StepTitle as={"p"} style={{ fontSize: "xs" }}>
                    {step.title}
                  </StepTitle>
                </Stack>
                {localStep === index && (
                  <Center>
                    <Icon
                      display={{ md: "none" }}
                      as={CaretDown}
                      boxSize={4}
                      transform={isOpen && "rotate(-180deg)"}
                      transition="transform .3s"
                    />
                  </Center>
                )}
              </Step>
              {isMobile && !isOpen ? null : (
                <StepSeparator
                  {...({
                    minWidth: { md: "4" },
                    position: "relative !important",
                    top: "unset !important",
                    left: "unset !important",
                    marginLeft: 4,
                    minHeight: { base: 4, md: "2px" },
                    height: { base: "4 !important", md: "2px !important" },
                  } as any)}
                />
              )}
            </WrapperComponent>
          ))}
        </Stepper>
        {steps[localStep].note}
      </Card>
    </Collapse>
  )
}

export default Onboarding
