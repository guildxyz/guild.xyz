import { Center, ChakraProps, Icon, Tooltip } from "@chakra-ui/react"
import { Check, CircleWavy } from "phosphor-react"

type Props = {
  iconSize: number
} & ChakraProps

const VerifiedIcon = ({ iconSize, ...chakraProps }: Props): JSX.Element => (
  <Tooltip label="Verified" hasArrow>
    <Center {...chakraProps} position="relative" {...chakraProps}>
      <Icon as={CircleWavy} boxSize={iconSize} color={"blue.500"} weight="fill" />
      <Icon
        as={Check}
        boxSize={iconSize / 2}
        color={"white"}
        weight="bold"
        position="absolute"
        top={"50%"}
        left={"50%"}
        transform={"translate(-50%, -50%)"}
      />
    </Center>
  </Tooltip>
)

export default VerifiedIcon
