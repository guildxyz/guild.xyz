import { Circle, Icon, SquareProps, Tooltip } from "@chakra-ui/react"
import { CircleWavyCheck } from "phosphor-react"

type Props = {
  iconSize: number
} & SquareProps

const VerifiedIcon = ({ iconSize, ...chakraProps }: Props): JSX.Element => (
  <Tooltip label="Verified" hasArrow>
    <Circle background={"blue.700"} {...chakraProps}>
      <Icon as={CircleWavyCheck} boxSize={iconSize} color={"white"} />
    </Circle>
  </Tooltip>
)

export default VerifiedIcon
