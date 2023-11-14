import { Box, Button, Container, HStack, Progress, Text } from "@chakra-ui/react"
import Card from "components/common/Card"
import { PropsWithChildren } from "react"
import GuildLottieProgress from "./components/GuildLottieProgress"

type Props = {
  next: () => void
  prev?: () => void
  progress: number
  isDisabled?: boolean
}

const GuildCreationProgress = ({
  next,
  progress,
  isDisabled,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const progressText = `${progress}%`

  return (
    <Box
      position={"fixed"}
      bottom={{ base: 0, md: 3 }}
      left={0}
      w={"full"}
      zIndex={1201} // above intercom floating button
    >
      <Container maxW={"container.lg"} px={{ base: 0, md: 8, lg: 10 }}>
        <Card
          w={{ md: "365px" }}
          ml={"auto"}
          borderRadius={{ base: 0, md: "2xl" }}
          shadow={{ base: "dark-lg", md: "xl" }}
          transition="0.2s ease"
        >
          <HStack justify={"space-between"} p={2} py={{ base: 3, md: 2 }}>
            <HStack gap={4} pl={3} pr={3}>
              <GuildLottieProgress progress={progress} />
              <Text colorScheme="gray" fontWeight={"semibold"} fontSize={"sm"}>
                Guild {progressText} completed
              </Text>
            </HStack>
            {children ?? (
              <Button colorScheme={"green"} onClick={next} isDisabled={isDisabled}>
                Continue
              </Button>
            )}
          </HStack>
          <Progress
            borderRadius="full"
            h={1}
            w="100%"
            value={progress}
            sx={{
              "& > div:first-child": {
                transitionProperty: "width",
              },
            }}
          />
        </Card>
      </Container>
    </Box>
  )
}

export default GuildCreationProgress
