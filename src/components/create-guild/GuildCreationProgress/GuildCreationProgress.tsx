import { Button, HStack, Progress, Text } from "@chakra-ui/react"
import FloatingFooter from "components/common/FloatingFooter"
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
    <FloatingFooter>
      <HStack justify="space-between" py={3} px={{ base: 2, md: 3 }}>
        <HStack gap={4} px={3}>
          <GuildLottieProgress progress={progress} />
          <Text colorScheme="gray" fontWeight="semibold" fontSize="sm">
            Guild {progressText} completed
          </Text>
        </HStack>
        {children ?? (
          <Button colorScheme="green" onClick={next} isDisabled={isDisabled}>
            Continue
          </Button>
        )}
      </HStack>
      <Progress
        hasStripe
        borderRadius="none"
        h={1}
        w="100%"
        value={progress}
        colorScheme="primary"
        sx={{
          "> div": {
            transitionProperty: "width",
          },
        }}
      />
    </FloatingFooter>
  )
}

export default GuildCreationProgress
