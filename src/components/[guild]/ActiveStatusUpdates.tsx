import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Collapse,
  Progress,
  Spinner,
  Stack,
  useColorMode,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import useActiveStatusUpdates from "hooks/useActiveStatusUpdates"

const ActiveStatusUpdates = () => {
  const { status, progress, params } = useActiveStatusUpdates()
  const { colorMode } = useColorMode()

  return (
    <Collapse in={status === "CREATED" || status === "STARTED"}>
      <Card mb="5" shadow="sm" borderRadius="xl">
        <Alert status="info" pos="relative" pb="6">
          <AlertIcon mt="2px" boxSize="5" as={Spinner} />
          <Stack spacing={0}>
            <AlertTitle>
              {progress.actionsDone === 0 && progress.total === 0
                ? "Preparing sync"
                : `Syncing ${progress.actionsDone}/${progress.total} members ${
                    params?.guildify ? "from Discord into your guild" : ""
                  }`}
            </AlertTitle>
            <AlertDescription>
              Roles & accesses may not be accurate. This can take a few hours, please
              be patient.
            </AlertDescription>
          </Stack>
          <Progress
            value={
              status === null
                ? 100
                : (progress.actionsDone / progress.total) * 100 || 1
            }
            colorScheme="blue"
            bg={colorMode === "light" ? "blue.50" : null}
            pos="absolute"
            bottom="0"
            left="0"
            right="0"
            size="sm"
            transition="width .3s"
          />
        </Alert>
      </Card>
    </Collapse>
  )
}

export default ActiveStatusUpdates
