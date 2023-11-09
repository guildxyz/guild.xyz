import { useSteps } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import useLocalStorage from "hooks/useLocalStorage"
import { createContext, PropsWithChildren, useContext } from "react"

const OnboardingContext = createContext<{
  localStep: number
  setLocalStep: (vaL: number) => void
} | null>({ localStep: null, setLocalStep: null })

const OnboardingProvider = ({ children }: PropsWithChildren<any>): JSX.Element => {
  const { id } = useGuild()
  const [localStep, setLocalStep] = useLocalStorage(`${id}_onboard_step`, 3)
  const { activeStep, setActiveStep } = useSteps({
    index: localStep,
  })

  return (
    <OnboardingContext.Provider
      value={{
        localStep: activeStep,
        setLocalStep: (index: number) => {
          setLocalStep(index)
          setActiveStep(index)
        },
      }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

const useOnboardingContext = () => useContext(OnboardingContext)

export default OnboardingProvider
export { useOnboardingContext }
