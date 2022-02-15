import { Player } from "@lottiefiles/react-lottie-player"

const AnimatedLogo = () => (
  <Player
    autoplay
    loop
    src="/logo_lottie.json"
    style={{
      height: 80,
      width: 80,
    }}
  />
)

export default AnimatedLogo
