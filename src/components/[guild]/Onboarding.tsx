import { Box, Flex, Heading, Text, VStack, Wrap } from "@chakra-ui/react"
import { Step, Steps, useSteps } from "chakra-ui-steps"
import Button from "components/common/Button"
import Card from "components/common/Card"
import { useRouter } from "next/router"
import { ArrowSquareOut, TwitterLogo } from "phosphor-react"

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
        members with roles you've created in step one can view them.{" "}
        <Button
          variant="link"
          fontWeight="medium"
          // size="xs"
          // borderRadius="md"
          colorScheme="primary"
          rightIcon={<ArrowSquareOut />}
          iconSpacing="1"
        >
          Need help?
        </Button>
        <br />
        If you want to gate your whole server to protect it and also your members DMs
        from bot spam, turn on{" "}
        <Button
          variant="link"
          fontWeight="medium"
          // size="xs"
          // borderRadius="md"
          colorScheme="primary"
          rightIcon={<ArrowSquareOut />}
          iconSpacing="1"
        >
          Guild guard
        </Button>
      </Text>
    ),
  },
  {
    label: "Summon members",
    content: (
      <Text>
        If you're satisfied with everything it's time to invite your fam to join!{" "}
      </Text>
    ),
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
        <Steps
          onClickStep={(step) => setStep(step)}
          activeStep={activeStep}
          colorScheme="gray"
          size="sm"
        >
          {steps.map(({ label, content }) => (
            <Step label={label} key={label}>
              <Box pt={6} pb="5">
                {content}
              </Box>
            </Step>
          ))}
        </Steps>
        {activeStep === steps.length ? (
          <VStack px={4} pt={6} pb="3" width="full">
            <Heading fontSize="xl" textAlign="center">
              Woohoo!
            </Heading>
            <Text textAlign="center">
              Your guild is ready! Summon more members by sharing it on Twitter
            </Text>
            <Wrap mx="auto" pt="2">
              <Button variant={"ghost"} onClick={reset} h="10">
                Dismiss
              </Button>
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
            </Wrap>
          </VStack>
        ) : (
          <Flex width="full" justify="flex-end">
            <Button
              isDisabled={activeStep === 0}
              mr={2}
              onClick={prevStep}
              size="sm"
              variant="ghost"
            >
              Prev
            </Button>
            <Button size="sm" onClick={nextStep}>
              {activeStep === steps.length - 1 ? "Send Join button" : "Next"}
            </Button>
          </Flex>
        )}
      </Card>
    </Card>
  )
}

export default Onboarding
