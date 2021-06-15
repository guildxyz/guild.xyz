import { Stack, StackDivider } from "@chakra-ui/react"
import Card from "components/common/Card"
import { useCommunity } from "components/community/Context"
import Level from "./components/Level"

const Levels = (): JSX.Element => {
  const { levels } = useCommunity()

  return (
    <Card py="10" px="6">
      <Stack spacing="10" divider={<StackDivider />}>
        {levels.map((level) => (
          <Level key={level.name} data={level} />
        ))}
      </Stack>
    </Card>
  )
}

export default Levels
