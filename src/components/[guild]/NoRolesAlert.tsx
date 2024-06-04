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
  areAllRolesInUse?: boolean
}

const NoRolesAlert = ({
  type = "GUILD",
  areAllRolesInUse = false,
}: Props): JSX.Element => {
  const entity = type === "GUILD" ? "guild" : "page"

  return (
    <Card>
      <Alert status="info">
        <AlertIcon boxSize="5" mr="2" mt="1px" />
        <Stack>
          <AlertTitle>
            {areAllRolesInUse
              ? "All the roles have this reward already"
              : "No public roles"}
          </AlertTitle>
          <AlertDescription>
            {areAllRolesInUse
              ? `It seems like all the roles within this ${entity} have this reward already. You can create a new role, and add this reward to it!`
              : `It seems like this ${entity} doesn't have any public roles. There might be some secret / hidden ones that you can unlock though!`}
          </AlertDescription>
        </Stack>
      </Alert>
    </Card>
  )
}

export default NoRolesAlert
