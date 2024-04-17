import { Box } from "@chakra-ui/react"
import {
  DotLottiePlayer,
  PlayerEvents,
  type DotLottieCommonPlayer,
} from "@dotlottie/react-player"
import { memo, useEffect, useRef, useState } from "react"

type Props = {
  progress: number
}

const progressToLottieState = (stepsProgress: number) => {
  if (!stepsProgress) return 0
  if (stepsProgress <= 20) return 10
  if (stepsProgress <= 40) return 14
  if (stepsProgress <= 50) return 18
  if (stepsProgress <= 75) return 20
  else return 35
}

const GuildLottieProgress = memo(({ progress }: Props) => {
  const lottiePlayerBg = useRef<DotLottieCommonPlayer>(null)
  const [isLottiePlayerReady, setIsLottiePlayerReady] = useState(false)
  const [player, setPlayer] = useState<DotLottieCommonPlayer>()
  const prevProgress = useRef(null)

  const logoSize = 24

  useEffect(() => {
    if (!isLottiePlayerReady || !progress) return

    player.playSegments(
      [
        progressToLottieState(prevProgress.current ?? 0),
        progressToLottieState(progress),
      ],
      true
    )
    prevProgress.current = progress
  }, [isLottiePlayerReady, progress, player])

  return (
    <Box position={"relative"} w={`${logoSize}px`} h={`${logoSize}px`}>
      <Box opacity={0.1} position={"absolute"} top={0} left={0} zIndex={0}>
        <DotLottiePlayer
          ref={lottiePlayerBg}
          onEvent={(event) => {
            if (event === PlayerEvents.Ready) {
              lottiePlayerBg.current.seek(52)
              setIsLottiePlayerReady(true)
            }
          }}
          src="/logo.lottie"
          style={{
            marginBottom: 24,
            height: logoSize,
            width: logoSize,
          }}
        />
      </Box>
      <Box position={"absolute"} top={0} left={0} zIndex={1}>
        <DotLottiePlayer
          src="/logo.lottie"
          style={{
            marginBottom: 24,
            height: logoSize,
            width: logoSize,
          }}
          speed={0.5}
          ref={(instance) => {
            setPlayer(instance)
          }}
        />
      </Box>
    </Box>
  )
})

export default GuildLottieProgress
