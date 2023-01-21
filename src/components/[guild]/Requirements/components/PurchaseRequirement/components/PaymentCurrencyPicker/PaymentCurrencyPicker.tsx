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
import { Chains } from "connectors"
import { ArrowSquareOut, CaretDown } from "phosphor-react"
import { useContext } from "react"
import { SUPPORTED_CURRENCIES } from "utils/guildCheckout"
import shortenHex from "utils/shortenHex"
import { usePurchaseRequirementContext } from "../PurchaseRequirementContex"
import CurrencyListItem from "./components/CurrencyListItem"
import TokenInfo from "./components/TokenInfo"

const PaymentCurrencyPicker = (): JSX.Element => {
  const { requirement, pickedCurrency } = usePurchaseRequirementContext()

  const { isOpen, onToggle, onClose } = useDisclosure()
  const circleBgColor = useColorModeValue("blackAlpha.100", "blackAlpha.300")
  const lightShade = useColorModeValue("white", "gray.700")
  const listBgColor = useColorModeValue("whiteAlpha.600", "transparent")

  const { account, chainId } = useWeb3React()
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
          textAlign="left"
          onClick={onToggle}
        >
          <HStack w="full" justifyContent="space-between">
            {pickedCurrency ? (
              <TokenInfo
                chainId={Chains[requirement.chain]}
                address={pickedCurrency}
              />
            ) : (
              <HStack spacing={4}>
                <Circle size={"var(--chakra-space-11)"} bgColor={circleBgColor} />
                <Text as="span">Choose currency</Text>
              </HStack>
            )}
            <Icon
              as={CaretDown}
              boxSize={4}
              transform={isOpen && "rotate(-180deg)"}
              transition="transform .3s"
            />
          </HStack>
        </Button>

        <Collapse in={isOpen} animateOpacity style={{ marginTop: 0 }}>
          <Stack divider={<Divider />} bgColor={listBgColor}>
            {SUPPORTED_CURRENCIES.filter(
              (c) => c.chainId === Chains[requirement.chain]
            ).map((c) => (
              <CurrencyListItem
                key={`${c.chainId}-${c.address}`}
                chainId={c.chainId}
                address={c.address}
                onPick={onClose}
              />
            ))}
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

export default PaymentCurrencyPicker
