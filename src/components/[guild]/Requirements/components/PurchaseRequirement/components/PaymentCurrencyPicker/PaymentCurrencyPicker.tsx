import {
  Circle,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
import { Chains } from "connectors"
import { ArrowSquareOut, CaretDown } from "phosphor-react"
import { SUPPORTED_CURRENCIES } from "utils/guildCheckout"
import shortenHex from "utils/shortenHex"
import { usePurchaseRequirementContext } from "../PurchaseRequirementContex"
import CurrencyListItem from "./components/CurrencyListItem"
import TokenInfo from "./components/TokenInfo"

const PaymentCurrencyPicker = (): JSX.Element => {
  const { requirement, pickedCurrency } = usePurchaseRequirementContext()

  const circleBgColor = useColorModeValue("blackAlpha.100", "blackAlpha.300")
  const lightShade = useColorModeValue("white", "gray.700")
  const lightShadeHover = useColorModeValue("gray.50", "gray.600")

  const { account } = useWeb3React()
  const { openAccountModal } = useWeb3ConnectionManager()

  return (
    <Stack spacing={3}>
      <Text as="span" fontWeight="bold">
        Payment currency
      </Text>

      <Menu gutter={0} matchWidth placement="bottom">
        {({ isOpen }) => (
          <>
            <MenuButton
              w="full"
              h="auto"
              p={4}
              bgColor={lightShade}
              _hover={{
                bgColor: lightShadeHover,
              }}
              borderTopRadius="2xl"
              borderBottomRadius={isOpen ? 0 : "2xl"}
              transition="border-radius 0.2s ease, background-color 0.2s ease"
              _focusVisible={{ boxShadow: "outline" }}
            >
              <HStack w="full" justifyContent="space-between">
                {pickedCurrency ? (
                  <TokenInfo
                    chainId={Chains[requirement.chain]}
                    address={pickedCurrency}
                  />
                ) : (
                  <HStack spacing={4}>
                    <Circle
                      size={"var(--chakra-space-11)"}
                      bgColor={circleBgColor}
                    />
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
            </MenuButton>

            <MenuList
              p={0}
              border="none"
              borderTopRadius={0}
              borderBottomRadius="2xl"
              overflow="hidden"
              transformOrigin="center"
            >
              {SUPPORTED_CURRENCIES.filter(
                (c) => c.chainId === Chains[requirement.chain]
              ).map((c) => (
                <CurrencyListItem
                  key={`${c.chainId}-${c.address}`}
                  chainId={c.chainId}
                  address={c.address}
                />
              ))}

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
            </MenuList>
          </>
        )}
      </Menu>
    </Stack>
  )
}

export default PaymentCurrencyPicker
