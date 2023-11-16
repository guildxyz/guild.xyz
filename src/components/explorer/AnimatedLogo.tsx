import { Player, type IPlayerProps } from "@lottiefiles/react-lottie-player"

const AnimatedLogo = (props: Partial<IPlayerProps> = {}) => {
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
      {...props}
    />
  )
}

const GuildCastleLoader = (props: Partial<IPlayerProps> = {}) => (
  <AnimatedLogo
    speed={1.8}
    lottieRef={(instance) => {
      let direction = 1

      const listener = () => {
        direction *= -1
        instance.setDirection(direction as -1 | 1)
        instance.play()
      }

      instance.addEventListener("complete", listener)
    }}
    {...props}
  />
)

export { GuildCastleLoader }
export default AnimatedLogo
