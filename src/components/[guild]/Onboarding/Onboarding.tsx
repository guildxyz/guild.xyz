import { Collapse } from "@chakra-ui/react"
import CreateGuildStepper from "components/create-guild/CreateGuildStepper"
import GuildCreationProgress from "components/create-guild/GuildCreationProgress"
import { atom, useAtom } from "jotai"
import { useEffect } from "react"
import { useThemeContext } from "../ThemeContext"
import useGuild from "../hooks/useGuild"

export const onboardingStepAtom = atom(0)

const Onboarding = (): JSX.Element => {
  const { onboardingComplete } = useGuild()
  const { localThemeColor, textColor } = useThemeContext()
  const [activeStep, setActiveStep] = useAtom(onboardingStepAtom)

  useEffect(() => {
    setActiveStep(3)
  }, [])

  return (
    <>
      <Collapse in={!onboardingComplete} unmountOnExit>
        <CreateGuildStepper
          color={localThemeColor}
          stepPart={0}
          {...{ activeStep, setActiveStep, textColor }}
          enableGoingBack={false}
          mb="8"
        />
      </Collapse>
      {activeStep === 3 && (
        <GuildCreationProgress
          progress={75}
          next={() => {
            console.log("ph event: jump to", { step: 5 })
            setActiveStep(4)
          }}
        />
      )}
    </>
  )
}

export default Onboarding
