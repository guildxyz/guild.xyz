import {
  Alert,
  AlertIcon,
  Button,
  Divider,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react"
import GuildLogo from "components/common/GuildLogo"
import { useState } from "react"
import { GuildBase } from "types"
import AnswerButton from "./AnswerButton"

const getRandomGuild = (guilds: GuildBase[]) =>
  guilds[Math.floor(Math.random()) * guilds.length]

const GuessName = ({ guilds }: { guilds: GuildBase[] }) => {
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false)
  const [solutionGuild] = useState<GuildBase>(getRandomGuild(guilds))
  const [selectedGuildId, setSelectedGuildId] = useState<number | null>()

  const isAnswerCorrect = selectedGuildId === solutionGuild.id

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
          <Text>{isAnswerSubmitted ? solutionGuild.name : "???"}</Text>
        </VStack>

        <VStack gap="3" w="100%">
          {guilds.map((guild) => (
            <AnswerButton
              key={guild.id}
              guild={guild}
              solutionGuild={solutionGuild}
              selectedGuildId={selectedGuildId}
              isAnswerSubmitted={isAnswerSubmitted}
              onSelect={() => setSelectedGuildId(guild.id)}
            />
          ))}
        </VStack>

        <Divider />

        {isAnswerSubmitted && (
          <Alert
            status={isAnswerCorrect ? "success" : "warning"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <AlertIcon />{" "}
            {isAnswerCorrect ? "Your answer is correct!" : "Wrong answer!"}
          </Alert>
        )}

        {isAnswerSubmitted && (
          <Button colorScheme="green" w="100%">
            Continue
          </Button>
        )}
        {!isAnswerSubmitted && (
          <Button
            colorScheme="green"
            w="100%"
            onClick={() => setIsAnswerSubmitted(true)}
          >
            Submit
          </Button>
        )}
      </VStack>
    </>
  )
}

export default GuessName
