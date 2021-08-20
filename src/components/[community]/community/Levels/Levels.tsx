import { Stack } from "@chakra-ui/react"
import Card from "components/common/Card"
import { useState } from "react"
import { Level as LevelType } from "temporaryData/types"
import AccessIndicator from "./components/AccessIndicator"
import LevelState from "./components/AccessIndicator/types"
import Level from "./components/Level"

type Props = {
  levels: LevelType[]
}

const Levels = ({ levels }: Props): JSX.Element => {
  const [levelsState, setLevelsState] = useState<{ [x: string]: LevelState }>({})

  return (
    <Card
      isFullWidthOnMobile
      pos="relative"
      pl={{ base: 6, sm: 8 }}
      pr={{ base: 5, sm: 7 }}
      order={
        Object.values(levelsState).some((level) => level.state === "access") && -1
      }
    >
      <Stack spacing="0">
        {levels.map((level) => (
          <Level key={level.name} data={level} setLevelsState={setLevelsState} />
        ))}
      </Stack>

      <AccessIndicator levelsState={levelsState} />
    </Card>
  )
}

export default Levels
