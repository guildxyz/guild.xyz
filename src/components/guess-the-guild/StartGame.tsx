import { Divider, Heading, Text, VStack } from "@chakra-ui/react"
import Button from "components/common/Button"
import { Difficulty } from "pages/guess-the-guild"

type Props = {
  onStart: () => void
  difficulty: Difficulty
  onDifficultyChange: (d: Difficulty) => void
  highscore: number
}

const StartGame = ({
  onStart,
  difficulty,
  onDifficultyChange,
  highscore,
}: Props) => (
  <VStack gap="5" px="3">
    <Heading
      as="h2"
      mb="3"
      fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
      textAlign="center"
      fontFamily="display"
    >
      GuildGesser 1.0
    </Heading>
    <Text textAlign="center">
      Are you an expert on Guilds? <br /> Test your knowledge in our guild guesser
      mini game!
    </Text>

    <Divider />

    <VStack gap="0">
      <Text
        as="span"
        mt="1"
        mr="2"
        fontSize="xs"
        fontWeight="bold"
        color="gray"
        textTransform="uppercase"
        noOfLines={1}
      >
        {"Your highscore"}
      </Text>
      <Text
        fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
        m={0}
        fontFamily="display"
        fontWeight={600}
      >
        {highscore}
      </Text>
    </VStack>

    <Divider />

    <Text
      as="span"
      mt="1"
      mr="2"
      fontSize="xs"
      fontWeight="bold"
      color="gray"
      textTransform="uppercase"
      noOfLines={1}
    >
      {"Select Difficulty"}
    </Text>

    <VStack w="100%">
      <Button
        w="100%"
        isActive={difficulty === Difficulty.Easy}
        onClick={() => onDifficultyChange(Difficulty.Easy)}
      >
        Easy
      </Button>
      <Button
        w="100%"
        isActive={difficulty === Difficulty.Medium}
        onClick={() => onDifficultyChange(Difficulty.Medium)}
      >
        Medium
      </Button>
      <Button
        w="100%"
        isActive={difficulty === Difficulty.Hard}
        onClick={() => onDifficultyChange(Difficulty.Hard)}
      >
        Hard
      </Button>

      <Text textAlign="center" fontSize="sm" opacity="0.6">
        Selection from the top {difficulty == 0 && "100"} {difficulty == 1 && "500"}{" "}
        {difficulty == 2 && "1000"} guilds.
        <br />
        Solving this difficulty awards {difficulty == 0 && "1x"}{" "}
        {difficulty == 1 && "2x"} {difficulty == 2 && "3x"} the usual points.
      </Text>
    </VStack>
    <Button w="100%" colorScheme="green" onClick={() => onStart()}>
      Let's Go!
    </Button>
  </VStack>
)

export default StartGame
