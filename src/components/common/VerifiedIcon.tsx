import { Circle, Container, Icon, SquareProps, Tooltip } from "@chakra-ui/react"
import { Check, CircleWavy } from "phosphor-react"

type Props = {
  iconSize: number
} & SquareProps

const VerifiedIcon = ({ iconSize, ...chakraProps }: Props): JSX.Element => (
  <Tooltip label="Verified" hasArrow>
    <Circle {...chakraProps}>
      <Container position="relative" h={iconSize} w={iconSize} p={0}>
        <Icon
          as={CircleWavy}
          boxSize={iconSize}
          color={"blue.500"}
          weight="fill"
          position="absolute"
        />
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
      </Container>
    </Circle>
  </Tooltip>
)

export default VerifiedIcon
