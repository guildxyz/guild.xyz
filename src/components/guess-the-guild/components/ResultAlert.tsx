import { Alert, AlertIcon } from "@chakra-ui/react"

const ResultAlert = ({ isAnswerCorrect }: { isAnswerCorrect: boolean }) => (
  <>
    <Alert
      status={isAnswerCorrect ? "success" : "warning"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <AlertIcon /> {isAnswerCorrect ? "Your answer is correct!" : "Wrong answer!"}
    </Alert>
  </>
)

export default ResultAlert
