import { Stack } from "@chakra-ui/react"
import { ThemeProvider, useThemeContext } from "components/[guild]/ThemeContext"
import GuildLogo from "components/common/GuildLogo"
import Layout from "components/common/Layout"
import CreateGuildButton from "components/create-guild/CreateGuildButton"
import {
  CreateGuildProvider,
  useCreateGuildContext,
} from "components/create-guild/CreateGuildContext"
import CreateGuildStepper, {
  STEPS,
} from "components/create-guild/CreateGuildStepper"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import GuildCreationProgress from "components/create-guild/GuildCreationProgress"
import { useFormContext, useWatch } from "react-hook-form"
import { GuildFormType } from "types"

const CreateGuildPage = (): JSX.Element => {
  const { textColor, localThemeColor, localBackgroundImage } = useThemeContext()
  const {
    activeStep,
    setActiveStep,
    stepPart,
    nextStep,
    nextStepIsDisabled,
    setPart,
  } = useCreateGuildContext()
  const { control } = useFormContext<GuildFormType>()

  const name = useWatch({ name: "name" })
  const imageUrl = useWatch({ name: "imageUrl" })

  const themeColor = useWatch({ name: "theme.color" })
  const color = localThemeColor !== themeColor ? themeColor : localThemeColor
  const isLastSubStep = STEPS[activeStep].progress.length === stepPart + 1

  return (
    <>
      <Layout
        title={name || "Create Guild"}
        backgroundOffset={47}
        textColor={textColor}
        background={color}
        backgroundImage={localBackgroundImage}
        image={
          imageUrl && (
            <GuildLogo
              imageUrl={imageUrl}
              size={{ base: "56px", lg: "72px" }}
              mt={{ base: 1, lg: 2 }}
              bgColor={textColor === "primary.800" ? "primary.800" : "transparent"}
            />
          )
        }
        imageUrl={imageUrl}
        showFooter={false}
      >
        <CreateGuildStepper
          {...{ color, activeStep, setActiveStep, textColor, stepPart }}
        />
        <Stack w="full" spacing={4} pt={STEPS[activeStep].content ? 6 : 0} pb="24">
          {STEPS[activeStep].content}
        </Stack>
        <GuildCreationProgress
          next={isLastSubStep ? nextStep : () => setPart(stepPart + 1)}
          progress={STEPS[activeStep].progress[stepPart]}
          isDisabled={nextStepIsDisabled}
        >
          {stepPart === 1 ? <CreateGuildButton /> : null}
        </GuildCreationProgress>
      </Layout>
      <DynamicDevTool control={control} />
    </>
  )
}

const CreateGuildPageWrapper = (): JSX.Element => (
  <CreateGuildProvider>
    <ThemeProvider>
      <CreateGuildPage />
    </ThemeProvider>
  </CreateGuildProvider>
)

export default CreateGuildPageWrapper
