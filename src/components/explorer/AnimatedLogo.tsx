import { Circle, useBreakpointValue } from "@chakra-ui/react"
import { Player } from "@lottiefiles/react-lottie-player"

const AnimatedLogo = () => {
  const logoSize = useBreakpointValue({ base: 24, md: 28, lg: 38 })

  return (
    <Circle size={{ base: 12, lg: 14 }} mr={-3} pt={{ base: "3px", lg: "8px" }}>
      <Player
        autoplay
        keepLastFrame
        speed={2}
        src="/logo_lottie.json"
        style={{
          height: logoSize,
          width: logoSize,
        }}
      />
    </Circle>
  )
}

export default AnimatedLogo
