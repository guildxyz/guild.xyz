import {
  Box,
  Center,
  ChakraProps,
  Icon,
  ResponsiveValue,
  Tooltip,
} from "@chakra-ui/react"
import { CircleWavyCheck } from "phosphor-react"

type Props = {
  size: ResponsiveValue<number>
} & ChakraProps

const VerifiedIcon = ({ size, ...chakraProps }: Props): JSX.Element => (
  <Tooltip label="Verified" hasArrow>
    <Center position="relative" {...chakraProps}>
      <Icon
        as={CircleWavyCheck}
        boxSize={size}
        color={"blue.500"}
        weight="fill"
        zIndex={1}
      />
      <Box pos="absolute" bg="white" inset="1.5" />
    </Center>
  </Tooltip>
)

export default VerifiedIcon
