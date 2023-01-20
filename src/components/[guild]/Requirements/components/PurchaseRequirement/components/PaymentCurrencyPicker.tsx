import {
  Circle,
  Collapse,
  Divider,
  HStack,
  Icon,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import { Web3Connection } from "components/_app/Web3ConnectionManager"
import { ArrowSquareOut, CaretDown } from "phosphor-react"
import { useContext } from "react"
import shortenHex from "utils/shortenHex"

const PaymentCurrencyPicker = (): JSX.Element => {
  const { isOpen, onToggle } = useDisclosure()
  const circleBgColor = useColorModeValue("blackAlpha.100", "blackAlpha.300")
  const lightShade = useColorModeValue("white", "gray.700")
  const listBgColor = useColorModeValue("whiteAlpha.600", "transparent")

  const { account } = useWeb3React()
  const { openAccountModal } = useContext(Web3Connection)

  return (
    <Stack spacing={3}>
      <Text as="span" fontWeight="bold">
        Payment currency
      </Text>

      <Stack borderRadius="xl" overflow="hidden">
        <Button
          variant="unstyled"
          w="full"
          h="auto"
          p={4}
          bgColor={lightShade}
          fontWeight="normal"
          borderRadius="none"
          onClick={onToggle}
        >
          <HStack justifyContent="space-between">
            <HStack spacing={4}>
              <Circle size={"var(--chakra-space-11)"} bgColor={circleBgColor} />
              <Text as="span">Choose currency</Text>
            </HStack>
            <Icon
              as={CaretDown}
              boxSize={4}
              transform={isOpen && "rotate(-180deg)"}
              transition="transform .3s"
            />
          </HStack>
        </Button>
        <Collapse in={isOpen} animateOpacity style={{ marginTop: 0 }}>
          <Stack divider={<Divider />} py={2} bgColor={listBgColor}>
            <CurrencyListItem />
            <CurrencyListItem />
            <CurrencyListItem />
          </Stack>
          <HStack
            justifyContent="space-between"
            bgColor={lightShade}
            h={8}
            px={4}
            fontSize="sm"
          >
            <Text as="span" colorScheme="gray">
              Connected address:
            </Text>

            <Button
              size="sm"
              variant="link"
              rightIcon={<Icon as={ArrowSquareOut} />}
              onClick={openAccountModal}
            >
              {shortenHex(account, 3)}
            </Button>
          </HStack>
        </Collapse>
      </Stack>
    </Stack>
  )
}

const CurrencyListItem = (): JSX.Element => {
  const circleBgColor = useColorModeValue("blackAlpha.100", "blackAlpha.300")

  return (
    <HStack spacing={4} px={4} py={2}>
      <Circle size={"var(--chakra-space-11)"} bgColor={circleBgColor} />
      <Stack spacing={0}>
        <Text as="span">
          0.25 ETH{" "}
          <Text as="span" colorScheme="gray">
            (Ethereum)
          </Text>
        </Text>
        <Text as="span" colorScheme="gray" fontSize="xs">
          Balance: 2.54 ETH
        </Text>
      </Stack>
    </HStack>
  )
}

export default PaymentCurrencyPicker
