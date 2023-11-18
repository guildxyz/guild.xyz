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
      bottom={0}
      left={0}
      w={"full"}
      zIndex={1201} // above intercom floating button
    >
      <Container maxW={"container.lg"} px={{ base: 0, md: 8, lg: 10 }}>
        {/**
         * Intercom: This box keeps the container padding, so the Card inside could be
         * `width:100%`
         */}
        <Box position="relative">
          <Card
            borderRadius={0}
            borderTopRadius={{ md: "2xl" }}
            borderWidth={{ base: "1px 0 0 0", md: "1px 1px 0 1px" }}
            shadow={
              "rgba(0, 0, 0, 0.1) 0px 5px 10px,rgba(0, 0, 0, 0.2) 0px 15px 40px"
            }
            position="absolute"
            bottom={0}
            w="full"
          >
            <HStack justify={"space-between"} py={3} px={{ base: 2, md: 3 }}>
              <HStack gap={4} px={3}>
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
              colorScheme="primary"
              sx={{
                "& > div:first-child": {
                  transitionProperty: "width",
                },
              }}
            />
          </Card>
        </Box>
      </Container>
    </Box>
  )
}

export default GuildCreationProgress
