import {
  Box,
  Collapse,
  HStack,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react"
import { Player } from "@lottiefiles/react-lottie-player"
import { Step, Steps, useSteps } from "chakra-ui-steps"
import Card from "components/common/Card"
import { useEffect, useState } from "react"
import useGuild from "../hooks/useGuild"
import { useOnboardingContext } from "./components/OnboardingProvider"

type Props = {
  activeStep: number
  prevStep: () => void
  nextStep: () => void
}

const GUILD_CASTLE_COMPLETED_FRAME = 38

const steps = [
  {
    title: "Set platforms",
    content: <></>,
  },
  {
    title: "Customize guild",
    content: <></>,
  },
  {
    title: "Choose template",
    content: <></>,
  },
  {
    title: "Edit roles",
    content: <></>,
  },
  {
    title: "Finish",
    content: <></>,
  },
]

const Onboarding = (): JSX.Element => {
  const { onboardingComplete } = useGuild()

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
        borderColor={"indigo.500"}
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
          onClickStep={orientation === "horizontal" ? setStep : undefined}
          activeStep={activeStep}
          colorScheme="primary"
          orientation={orientation}
          size="sm"
        >
          {steps.map(({ title, content }) => (
            <Step label={title} key={title}>
              <Box pt={{ md: 6 }} textAlign="left">
                {content}
              </Box>
            </Step>
          ))}
        </Steps>
        <HStack
          spacing={3}
          pos="absolute"
          bottom={6}
          opacity={0.8}
          display={{ base: "none", md: "flex" }}
        >
          <Player
            autoplay
            keepLastFrame
            speed={0.5}
            src="/logo_lottie.json"
            style={{
              height: 17,
              width: 17,
              opacity: 0.5,
            }}
            lottieRef={(instance) => {
              setPlayer(instance)
            }}
          />
          <Text colorScheme="gray" fontSize={"sm"} fontWeight="medium">
            guild {(activeStep + 1) * 25}% ready
          </Text>
        </HStack>
      </Card>
    </Collapse>
  )
}

export default Onboarding
