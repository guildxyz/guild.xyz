import {
  Box,
  Center,
  ChakraProps,
  Icon,
  ResponsiveValue,
  Tooltip,
} from "@chakra-ui/react"
import { PiSealCheck } from "react-icons/pi"

type Props = {
  size: ResponsiveValue<number>
} & ChakraProps

const VerifiedIcon = ({ size, ...chakraProps }: Props): JSX.Element => (
  <Box as="span" {...chakraProps}>
    <Tooltip label="This guild is verified by Guild.xyz" hasArrow>
      {/* the check in the middle is transparent by default, we use this wrapper to make it white */}
      <Center
        position="relative"
        _before={{ content: '""', bg: "white", pos: "absolute", inset: 1.5 }}
      >
        <Icon
          as={PiSealCheck}
          boxSize={size}
          color={"blue.500"}
          weight="fill"
          zIndex={1}
        />
      </Center>
    </Tooltip>
  </Box>
)

export default VerifiedIcon
