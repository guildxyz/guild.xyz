import { Text, useColorMode, VStack } from "@chakra-ui/react"
import Card from "components/common/Card"

type Props = {
  title: string
  color: string
}

const RuleCard = ({ title, color }: Props): JSX.Element => {
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
      borderColor={color}
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
      _hover={{
        _before: {
          opacity: 0.1,
        },
      }}
      _active={{
        _before: {
          opacity: 0.17,
        },
      }}
    >
      <VStack spacing={4} alignItems="start">
        <Text fontWeight="bold" letterSpacing="wide">{title}</Text>
      </VStack>
    </Card>
  )
}

export default RuleCard
