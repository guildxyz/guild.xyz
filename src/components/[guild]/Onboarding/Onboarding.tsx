import {
  Box,
  Collapse,
  Heading,
  HStack,
  Text,
  useBreakpointValue,
  useColorModeValue,
  VStack,
  Wrap,
} from "@chakra-ui/react"
import { useRumAction } from "@datadog/rum-react-integration"
import { Player } from "@lottiefiles/react-lottie-player"
import { Step, Steps, useSteps } from "chakra-ui-steps"
import Button from "components/common/Button"
import Card from "components/common/Card"
import type { AnimationItem } from "lottie-web"
import { useRouter } from "next/router"
import { TwitterLogo } from "phosphor-react"
import { useEffect, useState } from "react"
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
    label: "Add roles & requirements",
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
  const addDatadogAction = useRumAction("trackingAppAction")

  const { localStep, setLocalStep } = useOnboardingContext()
  const { nextStep, prevStep, activeStep, setStep } = useSteps({
    initialStep: localStep,
  })
  const router = useRouter()
  const orientation = useBreakpointValue<"vertical" | "horizontal">({
    base: "vertical",
    md: "horizontal",
  })
  const isDarkMode = useColorModeValue(false, true)

  useEffect(() => {
    setLocalStep(activeStep >= steps.length ? undefined : activeStep)
  }, [activeStep])

  const [prevActiveStep, setPrevActiveStep] = useState(-1)

  const [shareCardDismissed, setShareCardDismissed] = useState<boolean>(false)

  const [player, setPlayer] = useState<AnimationItem>()

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
    <Collapse in={!shareCardDismissed} unmountOnExit>
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
        {activeStep !== steps.length ? (
          <>
            <Steps
              onClickStep={
                orientation === "horizontal"
                  ? (step) => {
                      addDatadogAction(`click on step ${step + 1} [onboarding]`)
                      setStep(step)
                    }
                  : undefined
              }
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
              d={{ base: "none", md: "flex" }}
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
          </>
        ) : (
          <VStack px={4} pt={3} pb="3" width="full">
            <HStack mb="2">
              <Player
                autoplay
                keepLastFrame
                speed={2}
                src="/logo_lottie.json"
                style={{
                  height: 20,
                  width: 20,
                }}
                lottieRef={(instance) => {
                  setPlayer(instance)
                }}
              />
              <Heading fontSize="xl" textAlign="center">
                Your guild is ready!
              </Heading>
            </HStack>
            <Text textAlign="center">
              Summon more members by sharing it on Twitter
            </Text>
            <Wrap mx="auto" pt="2">
              <Button
                as="a"
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  `Just summoned my guild on @guildxyz! Join me on my noble quest: guild.xyz/${router.query.guild}`
                )}`}
                target="_blank"
                leftIcon={<TwitterLogo />}
                colorScheme="TWITTER"
                onClick={() => {
                  addDatadogAction("click on Share [onboarding]")
                  setShareCardDismissed(true)
                }}
                h="10"
              >
                Share
              </Button>
              <Button
                variant={"ghost"}
                onClick={() => {
                  addDatadogAction("click on Dismiss [onboarding]")
                  setShareCardDismissed(true)
                }}
                h="10"
              >
                Dismiss
              </Button>
            </Wrap>
          </VStack>
        )}
      </Card>
    </Collapse>
  )
}

export default Onboarding
