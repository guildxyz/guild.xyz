import {
  Alert,
  AlertIcon,
  AlertTitle,
  Collapse,
  Progress,
  Spinner,
} from "@chakra-ui/react"
import useActiveStatusUpdates from "hooks/useActiveStatusUpdates"

const ActiveStatusUpdates = () => {
  const { status, progress } = useActiveStatusUpdates()

  return (
    <Collapse in={status === "STARTED"}>
      <Alert status="info" pos="relative" pb="6">
        <AlertIcon mt="2px" boxSize="5" as={Spinner} />
        <AlertTitle>{`Syncing ${progress.accessCheckDone}/${progress.total} members`}</AlertTitle>
        <Progress
          value={(progress.total / progress.accessCheckDone) * 100}
          colorScheme="blue"
          pos="absolute"
          bottom="0"
          left="0"
          right="0"
          size="sm"
          transition="width .3s"
        />
      </Alert>
    </Collapse>
  )
}

export default ActiveStatusUpdates
