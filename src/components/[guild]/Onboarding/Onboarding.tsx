import {
  Collapse,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react"
import { Step, Steps, useSteps } from "chakra-ui-steps"
import Card from "components/common/Card"
import { useEffect, useState } from "react"
import { useThemeContext } from "../ThemeContext"
import useGuild from "../hooks/useGuild"
import { useOnboardingContext } from "./components/OnboardingProvider"
import SummonMembers from "./components/SummonMembers"

type Props = {
  activeStep: number
  prevStep: () => void
  nextStep: () => void
}

const GUILD_CASTLE_COMPLETED_FRAME = 38

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
      <>
        <Text colorScheme="gray" mt={8}>
          Your guild is created, and you’re already in! Edit & add roles as you want
        </Text>
      </>
    ),
  },
  {
    title: "Finish",
    note: <SummonMembers activeStep={3} />,
  },
]

const Onboarding = (): JSX.Element => {
  const { onboardingComplete } = useGuild()
  const { localThemeColor } = useThemeContext()

  const { localStep, setLocalStep } = useOnboardingContext()
  const { nextStep, prevStep, activeStep, setStep } = useSteps({
    initialStep: localStep,
  })

  const orientation = useBreakpointValue<"vertical" | "horizontal">({
    base: "vertical",
    md: "horizontal",
  })
  const isDarkMode = useColorModeValue(false, true)

  useEffect(() => {
    setLocalStep(activeStep === steps.length ? undefined : activeStep)
  }, [activeStep])

  const [prevActiveStep, setPrevActiveStep] = useState(-1)

  const [player, setPlayer] = useState<any>()

  useEffect(() => {
    if (!player) return
    player.playSegments(
      [
        GUILD_CASTLE_COMPLETED_FRAME * (prevActiveStep + 1) * 0.25,
        GUILD_CASTLE_COMPLETED_FRAME * (activeStep + 1) * 0.25,
      ],
      true
    )
    setPrevActiveStep(activeStep)
  }, [activeStep, player])

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
      >
        <Steps
          activeStep={localStep}
          colorScheme="primary"
          orientation={orientation}
          size="sm"
        >
          {steps.map(({ title }) => (
            <Step label={title} key={title}></Step>
          ))}
        </Steps>
        {steps[localStep].note}
      </Card>
    </Collapse>
  )
}

export default Onboarding
