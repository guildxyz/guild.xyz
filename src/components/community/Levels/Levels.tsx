import { useState } from "react"
import { Stack } from "@chakra-ui/react"
import Card from "components/common/Card"
import { useCommunity } from "components/community/Context"
import { Level, LevelData } from "./components/Level"
import AccessIndicator from "./components/AccessIndicator"

const Levels = (): JSX.Element => {
  const { levels } = useCommunity()

  const [levelsState, setLevelsState] = useState({})

  const onLevelChange = (levelData: LevelData) => {
    setLevelsState((prevState) => ({ ...prevState, [levelData.index]: levelData }))
  }

  return (
    <Card pos="relative" overflow="hidden" pl="8" pr="7">
      <Stack spacing="0">
        {levels.map((level, index) => (
          <Level
            key={level.name}
            index={index}
            data={level}
            onChangeHandler={onLevelChange}
          />
        ))}
      </Stack>

      <AccessIndicator levelsState={levelsState} />
    </Card>
  )
}

export default Levels
