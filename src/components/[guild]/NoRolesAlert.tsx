import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Stack,
} from "@chakra-ui/react"
import Card from "components/common/Card"

const NoRolesAlert = (): JSX.Element => (
  <Card>
    <Alert status="info">
      <AlertIcon boxSize="5" mr="2" mt="1px" />
      <Stack>
        <AlertTitle>Couldn't find roles</AlertTitle>
        <AlertDescription>
          It seems like this guild doesn't have any roles yet. If you're a guild
          admin, please add at least one role to your guild.
        </AlertDescription>
      </Stack>
    </Alert>
  </Card>
)

export default NoRolesAlert
