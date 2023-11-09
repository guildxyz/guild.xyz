import { Stack } from "@chakra-ui/react"
import Button from "components/common/Button"
import Card from "components/common/Card"
import DiscordRoleVideo from "components/common/DiscordRoleVideo"

type Props = {
  onSubmit?: () => void
}

const ServerSetupCard = ({ onSubmit }: Props): JSX.Element => (
  <Card px={{ base: 5, sm: 6 }} py={7}>
    <Stack spacing={8}>
      <DiscordRoleVideo />
      {onSubmit && (
        <Button colorScheme="green" onClick={onSubmit}>
          Got it
        </Button>
      )}
    </Stack>
  </Card>
)

export default ServerSetupCard
