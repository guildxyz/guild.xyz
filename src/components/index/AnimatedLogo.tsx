import { Circle, useBreakpointValue } from "@chakra-ui/react"
import { Player } from "@lottiefiles/react-lottie-player"

const AnimatedLogo = () => {
  const size = useBreakpointValue({ base: 48, lg: 56 })
  const logoSize = useBreakpointValue({ base: 24, md: 28, lg: 38 })
  const marginTop = useBreakpointValue({ base: 3, lg: 8 })
  const marginRight = useBreakpointValue({ base: -3, lg: -3 })

  return (
    <Circle size={`${size}px`} mr={marginRight}>
      <Player
        autoplay
        keepLastFrame
        speed={2}
        src="/logo_lottie.json"
        style={{
          marginTop,
          height: logoSize,
          width: logoSize,
        }}
      />
    </Circle>
  )
}

export default AnimatedLogo
