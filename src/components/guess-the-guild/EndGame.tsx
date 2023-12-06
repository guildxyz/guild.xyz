import { Alert, Button, Divider, Heading, Text, VStack } from "@chakra-ui/react"
import pluralize from "utils/pluralize"

const EndGame = ({ onRestart }: { onRestart: () => void }) => {
  const score = 22
  const highscore = 30

  const getMessage = () => {
    if (score <= 10) return "Better luck next time!"
    if (score <= 20) return "You're getting the hang of it!"
    return "It looks like we're dealing with a professional 👀"
  }

  return (
    <>
      <VStack>
        <Heading
          as="h2"
          fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
          textAlign="center"
          fontFamily="display"
        >
          Game Over
        </Heading>
        <Text textAlign="center">{getMessage()}</Text>

        <Divider mt="4" />
        <Text
          as="span"
          mt="1"
          fontSize="xs"
          fontWeight="bold"
          color="gray"
          textTransform="uppercase"
          noOfLines={1}
        >
          Final Score
        </Text>
        <Text
          fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
          mt="-2"
          mb="1"
          fontFamily="display"
          fontWeight="600"
        >
          {score} points
        </Text>

        {score > highscore && (
          <>
            <Alert status="success" justifyContent="center">
              🎉 New Highscore!
            </Alert>
          </>
        )}

        {score <= highscore && (
          <>
            <Text>
              Only <strong>{pluralize(highscore - score + 1, "point")}</strong> to go
              to beat your current highscore!
            </Text>
          </>
        )}

        <Divider mt="2" />

        <Button colorScheme="green" w="100%" mt="3" onClick={() => onRestart()}>
          Try Again!
        </Button>
      </VStack>
    </>
  )
}

export default EndGame
