import { Box, Heading, Text, VStack, Wrap } from "@chakra-ui/react"
import { Step, Steps, useSteps } from "chakra-ui-steps"
import Button from "components/common/Button"
import Card from "components/common/Card"
import { useRouter } from "next/router"
import { TwitterLogo } from "phosphor-react"
import PaginationButtons from "./components/PaginationButtons"
import SummonMembers from "./components/SummonMembers"

type Props = {
  prevStep: () => void
  nextStep: () => void
}

const steps = [
  {
    label: "Set roles & requirements",
    content: (props: Props) => (
      <>
        <Text>
          You can have multiple roles with different requirements. By default there's
          an open one that anyone can get by just connecting their wallet. Go ahead
          and set requirements for it, or create a new role below!
        </Text>
        <PaginationButtons {...props} isPrevDisabled />
      </>
    ),
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
  const { nextStep, prevStep, reset, activeStep, setStep } = useSteps({
    initialStep: 0,
  })
  const router = useRouter()

  return (
    <Card
      bgGradient="conic(from 4.9rad at 0% 150%, green.400, DISCORD.200, yellow.300, green.500)"
      bgBlendMode={"color"}
      borderWidth={3}
    >
      <Card
        p={{ base: 4, sm: 6 }}
        pos="relative"
        _before={{
          content: `""`,
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
            onClickStep={(step) => setStep(step)}
            activeStep={activeStep}
            colorScheme="gray"
            size="sm"
          >
            {steps.map(({ label, content: Content }) => (
              <Step label={label} key={label}>
                <Box pt={6}>
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
                onClick={reset}
                h="10"
              >
                Share
              </Button>
              <Button variant={"ghost"} onClick={reset} h="10">
                Dismiss
              </Button>
            </Wrap>
          </VStack>
        )}
      </Card>
    </Card>
  )
}

export default Onboarding
