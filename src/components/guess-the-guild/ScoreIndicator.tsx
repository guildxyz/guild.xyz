import { Alert, HStack, Progress, Tag, chakra } from "@chakra-ui/react"
import Card from "components/common/Card"

const ScoreIndicator = () => {
  const score = 100
  const highscore = 200

  const isHighscore = score > highscore

  return (
    <Card py="7" px="4" mb="3">
      {!isHighscore && (
        <>
          <HStack justifyContent="space-between" mb="2">
            <Tag>
              <chakra.span opacity="0.5">Score: </chakra.span> {score}
            </Tag>
            <Tag>
              <chakra.span opacity="0.5">Highscore: </chakra.span> {highscore}
            </Tag>
          </HStack>

          <Progress
            borderRadius="full"
            w="100%"
            size="sm"
            colorScheme="green"
            value={(score / highscore) * 100}
          />
        </>
      )}

      {isHighscore && (
        <>
          <Alert status="success" justifyContent="center" alignItems="center">
            🎉 New Highscore!{" "}
            <chakra.span ml="1" fontWeight="600">
              {score} points
            </chakra.span>
          </Alert>
        </>
      )}
    </Card>
  )
}

export default ScoreIndicator
