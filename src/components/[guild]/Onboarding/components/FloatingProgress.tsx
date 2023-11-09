import GuildCreationProgress from "components/create-guild/GuildCreationProgress"
import { useOnboardingContext } from "./OnboardingProvider"

const FloatingProgress = () => {
  const { localStep, setLocalStep } = useOnboardingContext()

  if (localStep == 3)
    return (
      <GuildCreationProgress
        progress={75}
        next={() => {
          setLocalStep(4)
        }}
      />
    )

  return null
}

export default FloatingProgress
