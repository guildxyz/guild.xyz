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
import AddRolesAndRequirements from "./components/AddRolesAndRequirements"
import { useOnboardingContext } from "./components/OnboardingProvider"
import PaginationButtons from "./components/PaginationButtons"
import SummonMembers from "./components/SummonMembers"

type Props = {
  activeStep: number
  prevStep: () => void
  nextStep: () => void
}

const GUILD_CASTLE_COMPLETED_FRAME = 38

const steps = [
  {
    label: "Roles, requirements, rewards",
    content: AddRolesAndRequirements,
  },
  {
    label: "Customize guild",
    content: (props: Props) => (
      <>
        <Text>
          Set a description, customize page appearance, and edit privacy settings
          with the gear icon above!
        </Text>
        <PaginationButtons {...props} />
      </>
    ),
  },
  {
    label: "Summon members",
    content: SummonMembers,
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
        borderColor="primary.500"
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
          {steps.map(({ label, content: Content }) => (
            <Step label={label} key={label}>
              <Box pt={{ md: 6 }} textAlign="left">
                <Content {...{ activeStep, prevStep, nextStep }} />
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
