import { useColorMode, VStack } from "@chakra-ui/react"
import Card from "components/common/Card"
import { useFormContext } from "react-hook-form"
import { RequirementTypeColors } from "temporaryData/types"

type Props = {
  index: number
}

const PoapFormCard = ({ index }: Props): JSX.Element => {
  const {
    register,
    getValues,
    formState: { errors },
  } = useFormContext()
  const type = getValues(`requirements.${index}.type`)

  const { colorMode } = useColorMode()

  return (
    <Card
      role="group"
      position="relative"
      px={{ base: 5, sm: 7 }}
      py="7"
      w="full"
      bg={colorMode === "light" ? "white" : "gray.700"}
      borderWidth={2}
      borderColor={RequirementTypeColors[type]}
      overflow="visible"
      _before={{
        content: `""`,
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        bg: "primary.300",
        opacity: 0,
        transition: "opacity 0.2s",
      }}
    >
      <VStack spacing={4} alignItems="start">
        PoapFormCard
      </VStack>
    </Card>
  )
}

export default PoapFormCard
