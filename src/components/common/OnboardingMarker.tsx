import { Box, Center, Icon } from "@chakra-ui/react"
import { useOnboardingContext } from "components/[guild]/Onboarding/components/OnboardingProvider"
import { Circle } from "phosphor-react"
import { useState } from "react"

const pulseColor = "var(--chakra-colors-primary-alpha)"

const OnboardingMarker = ({ step, children, ...rest }) => {
  const { localStep } = useOnboardingContext()
  const [hasClicked, setHasClicked] = useState(false)
  const handleClick = () => setHasClicked(true)

  const shouldShow = !hasClicked && step === localStep

  if (!shouldShow) return children

  return (
    <Box pos="relative" onClick={handleClick} {...rest}>
      {children}
      <Center
        boxSize="0"
        pos="absolute"
        right="1"
        bottom="1"
        pointerEvents={"none"}
        sx={{
          "@-webkit-keyframes pulse": {
            "0%": {
              WebkitBoxShadow: `0 0 0 0 ${pulseColor}`,
            },
            "70%": { WebkitBoxShadow: `0 0 0 15px transparent` },
            "100%": { WebkitBoxShadow: `0 0 0 0 transparent` },
          },
          "@keyframes pulse": {
            "0%": {
              MozBoxShadow: `0 0 0 0 ${pulseColor}`,
              boxShadow: `0 0 0 0 ${pulseColor}`,
            },
            "70%": {
              MozBoxShadow: `0 0 0 15px transparent`,
              boxShadow: `0 0 0 15px transparent`,
            },
            "100%": {
              MozBoxShadow: `0 0 0 0 transparent`,
              boxShadow: `0 0 0 0 transparent`,
            },
          },
        }}
      >
        <Icon
          as={Circle}
          weight="fill"
          pos="absolute"
          boxSize="3"
          color="primary.500"
          animation="pulse 2s infinite"
          borderRadius={"full"}
        />
      </Center>
    </Box>
  )
}

export default OnboardingMarker
