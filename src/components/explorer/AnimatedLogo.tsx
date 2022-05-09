import { Player } from "@lottiefiles/react-lottie-player"

const AnimatedLogo = () => {
  const logoSize = 16

  return (
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
  )
}

export default AnimatedLogo
