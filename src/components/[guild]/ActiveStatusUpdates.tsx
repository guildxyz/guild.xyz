import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Collapse,
  Spinner,
  Stack,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import useActiveStatusUpdates from "hooks/useActiveStatusUpdates"

const ActiveStatusUpdates = () => {
  const { status } = useActiveStatusUpdates()

  return (
    <Collapse in={status === "STARTED"} style={{ width: "100%" }}>
      <Card mb="5" shadow="sm" borderRadius="xl">
        <Alert status="info" pos="relative">
          <AlertIcon mt="2px" boxSize="5" as={Spinner} />
          <Stack spacing={0}>
            <AlertTitle>Syncing members</AlertTitle>
            <AlertDescription>
              Roles & accesses may not be accurate. This can take a few hours, please
              be patient.
            </AlertDescription>
          </Stack>
        </Alert>
      </Card>
    </Collapse>
  )
}

export default ActiveStatusUpdates
