import { ChakraProps } from "@chakra-ui/react"
import { useOnboardingContext } from "components/[guild]/Onboarding/components/OnboardingProvider"
import { PropsWithChildren, useState } from "react"
import PulseMarker from "./PulseMarker"

type Props = {
  step: number
  onClick?: () => void
} & ChakraProps

const OnboardingMarker = ({
  step,
  onClick,
  children,
  ...rest
}: PropsWithChildren<Props>) => {
  const { localStep } = useOnboardingContext()
  const [hasClicked, setHasClicked] = useState(false)
  const handleClick = () => {
    setHasClicked(true)
    onClick?.()
  }

  const hidden = hasClicked || step !== localStep

  return (
    <PulseMarker
      hidden={hidden}
      onClick={handleClick}
      cursor={(onClick && "pointer") || "unset"}
      {...rest}
    >
      {children}
    </PulseMarker>
  )
}

export default OnboardingMarker
