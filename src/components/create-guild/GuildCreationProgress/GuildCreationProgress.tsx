import { Box, Button, Container, HStack, Text } from "@chakra-ui/react"
import { Player } from "@lottiefiles/react-lottie-player"
import DisplayCard from "components/common/DisplayCard"
import { useRef } from "react"
import { useFormContext } from "react-hook-form"

type Props = {
  next: () => void
  progress: number
}

const GuildCreationProgress = ({ next, progress }: Props): JSX.Element => {
  const progressText = `${progress}%`
  const lottiePlayer = useRef(null)
  const lottiePlayerBg = useRef(null)
  const methods = useFormContext()

  function progressToLottieState(stepsProgress: number): number {
    if (stepsProgress <= 20) return 10
    if (stepsProgress <= 40) return 14
    else return 80
  }

  const logoSize = 24

  return (
    <Box position={"fixed"} bottom={0} left={0} w={"full"}>
      <Container maxW={"container.lg"}>
        <DisplayCard
          w={"sm"}
          px={{ base: 2, md: 2 }}
          py={{ base: 2, md: 2 }}
          ml={"auto"}
          mb={3}
        >
          <HStack justify={"space-between"}>
            <HStack gap={5} pl={3}>
              <Box position={"relative"} w={`${logoSize}px`} h={`${logoSize}px`}>
                <Box opacity={0.1} position={"absolute"} top={0} left={0} zIndex={0}>
                  <Player
                    ref={lottiePlayerBg}
                    autoplay
                    keepLastFrame
                    speed={1}
                    src="/logo_lottie.json"
                    style={{
                      marginBottom: 24,
                      height: logoSize,
                      width: logoSize,
                      color: "white",
                    }}
                  />
                </Box>
                <Box position={"absolute"} top={0} left={0} zIndex={1}>
                  <Player
                    ref={lottiePlayer}
                    onEvent={(event) => {
                      if (event === "load") {
                        lottiePlayer.current?.setSeeker(
                          progressToLottieState(progress),
                          true
                        )
                      }
                    }}
                    keepLastFrame
                    speed={1}
                    src="/logo_lottie.json"
                    style={{
                      marginBottom: 24,
                      height: logoSize,
                      width: logoSize,
                      color: "white",
                    }}
                  />
                </Box>
              </Box>
              <Text colorScheme="gray"> Guild {progressText} completed</Text>
            </HStack>
            <Button colorScheme={"green"} onClick={next}>
              Continue
            </Button>
          </HStack>
        </DisplayCard>
      </Container>
    </Box>
  )
}

export default GuildCreationProgress
