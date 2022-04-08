import { Box, Flex, Heading, Text } from "@chakra-ui/react"
import { Step, Steps, useSteps } from "chakra-ui-steps"
import Button from "components/common/Button"
import Card from "components/common/Card"
import Link from "components/common/Link"

const steps: Array<{ label: string; content: JSX.Element }> = [
  {
    label: "Set roles & requirements",
    content: (
      <Text>
        You can have multiple roles with different requirements that you'll be able
        to gate your server with as you want. By default there's an open one that
        anyone can get by just connecting their wallet. Go ahead and set requirements
        for it, or create a new role below!
      </Text>
    ),
  },
  {
    label: "Customize guild",
    content: (
      <Text>
        Set a description, customize page appearance, and edit privacy settings with
        the gear icon above!
      </Text>
    ),
  },
  {
    label: "Gate Discord",
    content: (
      <Text>
        Head over to Discord and tune permissions of channels/categories so that only
        members with roles you've created in step one can view them. [Need help?] If
        you want to gate your whole server to protect it and also your members DMs
        from bot spam, turn on <Link href="#">Guild guard</Link>
      </Text>
    ),
  },
  {
    label: "Summone members",
    content: (
      <Text>
        If you're satisfied with everything it's time to invite your fam to join!{" "}
      </Text>
    ),
  },
]

const Onboarding = (): JSX.Element => {
  const { nextStep, prevStep, reset, activeStep } = useSteps({
    initialStep: 0,
  })

  return (
    <Card>
      <Box p={{ base: 4, sm: 6 }} bgColor="blackAlpha.300">
        <Steps activeStep={activeStep} colorScheme="indigo">
          {steps.map(({ label, content }) => (
            <Step label={label} key={label}>
              <Box py={4}>{content}</Box>
            </Step>
          ))}
        </Steps>
        {activeStep === steps.length ? (
          <Flex px={4} py={4} width="full" flexDirection="column">
            <Heading fontSize="xl" textAlign="center">
              Woohoo!
            </Heading>
            <Text textAlign="center">
              Your guild is ready! Summon more members by sharing it on Twitter
            </Text>
            <Button mx="auto" mt={6} size="sm" onClick={reset}>
              Reset
            </Button>
          </Flex>
        ) : (
          <Flex width="full" justify="flex-end">
            <Button
              isDisabled={activeStep === 0}
              mr={4}
              onClick={prevStep}
              size="sm"
              variant="ghost"
            >
              Prev
            </Button>
            <Button size="sm" onClick={nextStep}>
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </Flex>
        )}
      </Box>
    </Card>
  )
}

export default Onboarding
