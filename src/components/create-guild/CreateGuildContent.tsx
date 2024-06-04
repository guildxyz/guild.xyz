import { Stack } from "@chakra-ui/react"
import { useThemeContext } from "components/[guild]/ThemeContext"
import { usePostHogContext } from "components/_app/PostHogProvider"
import { Layout } from "components/common/CompoundLayout"
import CreateGuildButton from "components/create-guild/CreateGuildButton"
import { useCreateGuildContext } from "components/create-guild/CreateGuildContext"
import CreateGuildStepper, {
  STEPS,
} from "components/create-guild/CreateGuildStepper"
import GuildCreationProgress from "components/create-guild/GuildCreationProgress"
import { useEffect } from "react"
import { useWatch } from "react-hook-form"

export function CreateGuildContent() {
  const { textColor, localThemeColor } = useThemeContext()
  const {
    activeStep,
    setActiveStep,
    stepPart,
    nextStep,
    nextStepIsDisabled,
    setPart,
  } = useCreateGuildContext()
  const contacts = useWatch({ name: "contacts" })
  const { captureEvent } = usePostHogContext()
  const themeColor = useWatch({ name: "theme.color" })
  const color = localThemeColor !== themeColor ? themeColor : localThemeColor
  const isLastSubStep = STEPS[activeStep].progress.length === stepPart + 1

  const nextWithPostHog = () => {
    // +2 because, index starts with 0 and we jump to the step after the active one
    captureEvent("guild creation flow > continue", { to: activeStep + 2 })

    // email can be added in step 2
    if (activeStep === 1 && contacts[0].contact)
      captureEvent("guild creation flow > contacts added")

    nextStep()
  }

  useEffect(() => {
    captureEvent("guild creation flow > start guild creation")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Layout.Content>
      <CreateGuildStepper
        {...{ color, activeStep, setActiveStep, textColor, stepPart }}
      />
      <Stack w="full" spacing={4} pt={STEPS[activeStep].content ? 6 : 0} pb="24">
        {STEPS[activeStep].content}
      </Stack>
      <GuildCreationProgress
        next={isLastSubStep ? nextWithPostHog : () => setPart(stepPart + 1)}
        progress={STEPS[activeStep].progress[stepPart]}
        isDisabled={nextStepIsDisabled}
      >
        {stepPart === 1 ? <CreateGuildButton /> : null}
      </GuildCreationProgress>
    </Layout.Content>
  )
}
