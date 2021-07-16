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
    <Card
      isFullWidthOnMobile
      pos="relative"
      overflow="hidden"
      pl={{ base: 6, sm: 8 }}
      pr={{ base: 5, sm: 7 }}
    >
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
