import { Alert, HStack, Progress, Tag, chakra } from "@chakra-ui/react"
import Card from "components/common/Card"

const ScoreIndicator = ({
  score,
  highscore,
}: {
  score: number
  highscore: number
}) => {
  const isHighscore = score > highscore

  return (
    <Card py="7" px="4" mb="3" id="score-indicator">
      {!isHighscore && (
        <>
          <HStack justifyContent="space-between" mb="2">
            <Tag>
              <chakra.span opacity="0.5" mr="1">
                Score:{" "}
              </chakra.span>{" "}
              {score}
            </Tag>
            <Tag>
              <chakra.span opacity="0.5" mr="1">
                Highscore:{" "}
              </chakra.span>{" "}
              {highscore}
            </Tag>
          </HStack>

          <Progress
            borderRadius="full"
            w="100%"
            size="sm"
            colorScheme="green"
            value={highscore ? (score / highscore) * 100 : 0}
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
