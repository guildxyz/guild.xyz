import { Flex, Img } from "@chakra-ui/react"

type Props = {
  logic: "AND" | "OR" | "NOR" | "NAND"
}

const LogicIcon = ({ logic }: Props): JSX.Element => (
  <Flex
    alignItems="center"
    justifyContent="center"
    position="absolute"
    left={{ base: "50%", md: -10 }}
    top={{ base: -10, md: 10 }}
    ml={{ base: -6, md: 0 }}
    boxSize={14}
    bgColor="gray.700"
    borderWidth={4}
    borderColor="gray.800"
    rounded="full"
    zIndex="docked"
  >
    <Img src={`/logicIcons/${logic.toLowerCase()}.svg`} alt={logic} boxSize={6} />
  </Flex>
)

export default LogicIcon
