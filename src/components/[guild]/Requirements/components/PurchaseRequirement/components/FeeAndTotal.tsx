import {
  Divider,
  HStack,
  Icon,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react"
import { Info } from "phosphor-react"

const FeeAndTotal = (): JSX.Element => {
  const textColor = useColorModeValue("gray.800", "gray.200")
  const textAccentColor = useColorModeValue("black", "white")

  return (
    <Stack divider={<Divider />} color={textColor}>
      <HStack justifyContent="space-between">
        <HStack>
          <Text as="span">Fee</Text>
          <Tooltip
            label="Provider fee + 1% Guild fee + estimated network fee"
            placement="top"
            hasArrow
          >
            <Icon as={Info} />
          </Tooltip>
        </HStack>
        <Text as="span">0.025 ETH</Text>
      </HStack>

      <HStack justifyContent="space-between">
        <Text as="span">Total</Text>
        <Text as="span">
          $16 ={" "}
          <Text as="span" color={textAccentColor} fontWeight="semibold">
            0.28 ETH
          </Text>
        </Text>
      </HStack>
    </Stack>
  )
}

export default FeeAndTotal
