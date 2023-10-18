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
          <AlertTitle>No public roles</AlertTitle>
          <AlertDescription>
            {`It seems like this ${entity} doesn't have any public roles. There might be some secret / hidden ones that you can unlock though!`}
          </AlertDescription>
        </Stack>
      </Alert>
    </Card>
  )
}

export default NoRolesAlert
