import { Stack, StackDivider } from "@chakra-ui/react"
import Card from "components/common/Card"
import type { Level as LevelType, Token } from "temporaryData/types"
import Level from "./components/Level"

type Props = {
  data: LevelType[]
  token: Token
}

const Levels = ({ data, token }: Props): JSX.Element => (
  <Card py="10" px="6">
    <Stack spacing="10" divider={<StackDivider />}>
      {data.map((level) => (
        <Level key={level.name} data={level} token={token} />
      ))}
    </Stack>
  </Card>
)

export default Levels
