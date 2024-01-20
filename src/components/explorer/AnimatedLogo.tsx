import { DotLottiePlayer } from "@dotlottie/react-player"

const AnimatedLogo = () => {
  const logoSize = 16

  return (
    <DotLottiePlayer
      autoplay
      speed={2}
      src="/logo.lottie"
      style={{
        height: logoSize,
        width: logoSize,
      }}
    />
  )
}

export default AnimatedLogo
