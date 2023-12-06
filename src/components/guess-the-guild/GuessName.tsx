import { Button, Divider, Heading, Text, VStack } from "@chakra-ui/react"
import GuildLogo from "components/common/GuildLogo"
import { useState } from "react"

const GuessName = () => {
  const [submitted, setSubmitted] = useState(false)
  const [answer, setAnswer] = useState<number | null>()

  return (
    <>
      <VStack gap="5">
        <Heading
          as="h2"
          fontSize={{ base: "md", md: "lg", lg: "xl" }}
          textAlign="center"
          fontFamily="display"
        >
          Guess the guild by the logo!
        </Heading>
        <VStack>
          <GuildLogo size="100px" />
          <Text>{"???"}</Text>
        </VStack>

        <VStack gap="3" w="100%">
          <Button
            id="1"
            w="100%"
            colorScheme={answer === 1 ? "green" : "gray"}
            onClick={() => setAnswer(1)}
          >
            A
          </Button>
          <Button
            id="2"
            w="100%"
            colorScheme={answer === 2 ? "green" : "gray"}
            onClick={() => setAnswer(2)}
          >
            B
          </Button>
          <Button
            id="3"
            w="100%"
            colorScheme={answer === 3 ? "green" : "gray"}
            onClick={() => setAnswer(3)}
          >
            C
          </Button>
          <Button
            id="4"
            w="100%"
            colorScheme={answer === 4 ? "green" : "gray"}
            onClick={() => setAnswer(4)}
          >
            D
          </Button>
        </VStack>

        <Divider />

        {submitted && (
          <Button colorScheme="green" w="100%">
            Continue
          </Button>
        )}
        {!submitted && (
          <Button colorScheme="green" w="100%" onClick={() => setSubmitted(true)}>
            Submit
          </Button>
        )}
      </VStack>
    </>
  )
}

export default GuessName
