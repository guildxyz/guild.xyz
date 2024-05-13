import { Box, Button, HStack, useColorModeValue } from "@chakra-ui/react"
import { motion } from "framer-motion"
import { GameLevel } from "types"

type Props = {
  selected: GameLevel
  levelSelectDisable: boolean
  onSelect: (level: GameLevel) => void
}

const SelectGameLevel = ({
  selected,
  levelSelectDisable,
  onSelect,
}: Props): JSX.Element => {
  const selectedBg = useColorModeValue("white", "gray.600")
  const selectedShadow = "0 0.5px 2px 0 rgba(0, 0, 0, 0.2)"
  const MotionBox = motion(Box)
  const gameLevels: GameLevel[] = [GameLevel.Easy, GameLevel.Medium, GameLevel.Hard]

  return (
    <>
      <HStack as="ul" gap={1.5} justify="flex-end" mb="2">
        {gameLevels.map((level) => (
          <Box key={level} position={"relative"}>
            <Button
              isDisabled={levelSelectDisable}
              size="sm"
              variant="ghost"
              borderRadius="lg"
              onClick={() => onSelect(level)}
              zIndex={1}
              {...(selected === level && { _hover: { bg: "transparent" } })}
            >
              {level === 100 ? "Easy" : level === 500 ? "Medium" : "Hard"}
            </Button>
            {selected === level ? (
              <MotionBox
                style={{
                  position: "absolute",
                  inset: 0,
                }}
                layoutId="slide-bg"
                transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                boxShadow={selectedShadow}
                borderRadius="lg"
                bgColor={`${selectedBg} !important`}
                height="var(--chakra-sizes-8)"
              />
            ) : null}
          </Box>
        ))}
      </HStack>
    </>
  )
}

export default SelectGameLevel
