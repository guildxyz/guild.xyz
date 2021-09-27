import { Divider, Flex } from "@chakra-ui/react"

type Props = {
  logic: string
}

const LogicDivider = ({ logic }: Props): JSX.Element => (
  <Flex px={4} py={1} width="full" alignItems="center" justifyContent="center">
    <Divider width="full" />
    <Flex
      px={4}
      alignItems="center"
      justifyContent="center"
      fontSize="sm"
      fontWeight="bold"
      color="whiteAlpha.400"
    >
      {logic}
    </Flex>
    <Divider width="full" />
  </Flex>
)

export default LogicDivider
