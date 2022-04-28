import { Box, Center, Icon } from "@chakra-ui/react"
import { useOnboardingContext } from "components/[guild]/Onboarding/components/OnboardingContext"
import { HandPointing } from "phosphor-react"
import { useState } from "react"

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
        w="0"
        h="0"
        pos="absolute"
        right="1"
        bottom="1"
        pointerEvents={"none"}
        sx={{
          "@-webkit-keyframes pulse": {
            "0%": { WebkitBoxShadow: "0 0 0 0 rgba(204,169,44, 0.4)" },
            "70%": { WebkitBoxShadow: "0 0 0 10px rgba(204,169,44, 0)" },
            "100%": { WebkitBoxShadow: "0 0 0 0 rgba(204,169,44, 0)" },
          },
          "@keyframes pulse": {
            "0%": {
              MozBoxShadow: "0 0 0 0 rgba(204,169,44, 0.4)",
              boxShadow: "0 0 0 0 rgba(204,169,44, 0.4)",
            },
            "70%": {
              MozBoxShadow: "0 0 0 10px rgba(204,169,44, 0)",
              boxShadow: "0 0 0 10px rgba(204,169,44, 0)",
            },
            "100%": {
              MozBoxShadow: "0 0 0 0 rgba(204,169,44, 0)",
              boxShadow: "0 0 0 0 rgba(204,169,44, 0)",
            },
          },
        }}
      >
        <Icon
          as={HandPointing}
          pos="absolute"
          boxSize="5"
          color="yellow.500"
          animation="pulse 2s infinite"
          borderRadius={"full"}
        />
      </Center>
    </Box>
  )
}

export default OnboardingMarker
