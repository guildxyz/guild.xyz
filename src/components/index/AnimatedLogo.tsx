import { Player } from "@lottiefiles/react-lottie-player"

const AnimatedLogo = () => (
  <Player
    autoplay
    keepLastFrame
    // speed={2}
    src="/logo_lottie.json"
    style={{
      height: "45px",
      width: "45px",
    }}
  />
)

export default AnimatedLogo
