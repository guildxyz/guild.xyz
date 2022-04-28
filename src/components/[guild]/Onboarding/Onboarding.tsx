import {
  Box,
  Collapse,
  Heading,
  Text,
  useBreakpointValue,
  useColorModeValue,
  VStack,
  Wrap,
} from "@chakra-ui/react"
import { Step, Steps, useSteps } from "chakra-ui-steps"
import Button from "components/common/Button"
import Card from "components/common/Card"
import { useRouter } from "next/router"
import { TwitterLogo } from "phosphor-react"
import { useEffect, useState } from "react"
import AddRolesAndRequirements from "./components/AddRolesAndRequirements"
import { useOnboardingContext } from "./components/OnboardingProvider"
import PaginationButtons from "./components/PaginationButtons"
import SummonMembers from "./components/SummonMembers"

type Props = {
  prevStep: () => void
  nextStep: () => void
}

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
  const { localStep, setLocalStep } = useOnboardingContext()
  const { nextStep, prevStep, activeStep, setStep } = useSteps({
    initialStep: localStep,
  })
  const router = useRouter()
  const orientation = useBreakpointValue<"vertical" | "horizontal">({
    base: "vertical",
    md: "horizontal",
  })
  const content = useColorModeValue(null, `""`)

  useEffect(() => {
    setLocalStep(activeStep >= steps.length ? undefined : activeStep)
  }, [activeStep])

  const [shareCardDismissed, setShareCardDismissed] = useState<boolean>(false)

  return (
    <Collapse in={!shareCardDismissed} unmountOnExit>
      <Card
        borderColor="onboarding.500"
        borderWidth={3}
        p={{ base: 4, sm: 6 }}
        mb="8"
        pos="relative"
        _before={{
          content,
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          bg: "blackAlpha.300",
          zIndex: 0,
        }}
        sx={{ "*": { zIndex: 1 } }}
      >
        {activeStep !== steps.length ? (
          <Steps
            onClickStep={
              orientation === "horizontal" ? (step) => setStep(step) : undefined
            }
            activeStep={activeStep}
            colorScheme="onboarding"
            orientation={orientation}
            size="sm"
          >
            {steps.map(({ label, content: Content }) => (
              <Step label={label} key={label}>
                <Box pt={{ md: 6 }} textAlign="left">
                  <Content {...{ prevStep, nextStep }} />
                </Box>
              </Step>
            ))}
          </Steps>
        ) : (
          <VStack px={4} pt={3} pb="3" width="full">
            <Heading fontSize="xl" textAlign="center">
              Woohoo!
            </Heading>
            <Text textAlign="center">
              Your guild is ready! Summon more members by sharing it on Twitter
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
                onClick={() => setShareCardDismissed(true)}
                h="10"
              >
                Share
              </Button>
              <Button
                variant={"ghost"}
                onClick={() => setShareCardDismissed(true)}
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
