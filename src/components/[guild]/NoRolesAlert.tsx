import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Stack,
} from "@chakra-ui/react"
import Card from "components/common/Card"

type Props = {
  type?: "GUILD" | "GROUP"
}

const NoRolesAlert = ({ type = "GUILD" }: Props): JSX.Element => {
  const entity = type === "GUILD" ? "guild" : "campaign"

  return (
    <Card>
      <Alert status="info">
        <AlertIcon boxSize="5" mr="2" mt="1px" />
        <Stack>
          <AlertTitle>Couldn't find roles</AlertTitle>
          <AlertDescription>
            {`It seems like this ${entity} doesn't have any roles yet. If you're a guild
          admin, please add at least one role to your ${entity}.`}
          </AlertDescription>
        </Stack>
      </Alert>
    </Card>
  )
}

export default NoRolesAlert
