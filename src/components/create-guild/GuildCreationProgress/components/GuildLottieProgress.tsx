import { Box } from "@chakra-ui/react"
import { Player } from "@lottiefiles/react-lottie-player"
import { memo, useEffect, useRef, useState } from "react"

type Props = {
  progress: number
}

const GuildLottieProgress = memo(({ progress }: Props) => {
  const lottiePlayerBg = useRef(null)
  const [seekBg, setSeekBG] = useState(0)
  const [player, setPlayer] = useState<any>()
  const prevProgress = useRef(null)

  function progressToLottieState(stepsProgress: number): number {
    if (stepsProgress === null) return 0
    if (stepsProgress <= 20) return 10
    if (stepsProgress <= 40) return 14
    if (stepsProgress <= 50) return 18
    if (stepsProgress <= 75) return 20
    else return 80
  }
  const logoSize = 24

  useEffect(() => {
    lottiePlayerBg.current?.setSeeker(seekBg, false)
  }, [seekBg])

  useEffect(() => {
    if (player) {
      player.playSegments(
        [
          progressToLottieState(prevProgress.current),
          progressToLottieState(progress),
        ],
        true
      )
      prevProgress.current = progress
    }
  }, [player, progress])

  return (
    <Box position={"relative"} w={`${logoSize}px`} h={`${logoSize}px`}>
      <Box opacity={0.1} position={"absolute"} top={0} left={0} zIndex={0}>
        <Player
          ref={lottiePlayerBg}
          onEvent={(event) => {
            if (event === "load") {
              setSeekBG(50)
            }
          }}
          src="/logo_lottie.json"
          style={{
            marginBottom: 24,
            height: logoSize,
            width: logoSize,
          }}
        />
      </Box>
      <Box position={"absolute"} top={0} left={0} zIndex={1}>
        <Player
          src="/logo_lottie.json"
          style={{
            marginBottom: 24,
            height: logoSize,
            width: logoSize,
          }}
          speed={0.5}
          keepLastFrame
          lottieRef={(instance) => {
            setPlayer(instance)
          }}
        />
      </Box>
    </Box>
  )
})

export default GuildLottieProgress
