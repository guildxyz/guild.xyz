import {
  Collapse,
  Icon,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import useGuild from "components/[guild]/hooks/useGuild"
import { usePostHogContext } from "components/_app/PostHogProvider"
import { Chains, RPC } from "connectors"
import { ShoppingCartSimple } from "phosphor-react"
import BlockExplorerUrl from "../BlockExplorerUrl"
import { useRequirementContext } from "../RequirementContext"
import AlphaTag from "./components/AlphaTag"
import ConnectWalletButton from "./components/buttons/ConnectWalletButton"
import PurchaseAllowanceButton from "./components/buttons/PurchaseAllowanceButton"
import PurchaseButton from "./components/buttons/PurchaseButton"
import SwitchNetworkButton from "./components/buttons/SwitchNetworkButton"
import ErrorCollapse from "./components/ErrorCollapse"
import { useGuildCheckoutContext } from "./components/GuildCheckoutContex"
import PaymentCurrencyPicker from "./components/PaymentCurrencyPicker"
import PaymentMethodButtons from "./components/PaymentMethodButtons"
import PurchasedRequirementInfo from "./components/PurchasedRequirementInfo"
import PurchaseFeeAndTotal from "./components/PurchaseFeeAndTotal"
import TOSCheckbox from "./components/TOSCheckbox"
import usePrice from "./hooks/usePrice"

const PurchaseRequirement = (): JSX.Element => {
  const { captureEvent } = usePostHogContext()

  const { account, chainId } = useWeb3React()

  const requirement = useRequirementContext()
  const { isOpen, onOpen, onClose } = useGuildCheckoutContext()

  const { urlName, name } = useGuild()

  const {
    data: { estimatedPriceInUSD },
    isValidating,
    error,
  } = usePrice(RPC[requirement?.chain]?.nativeCurrency?.symbol)

  const onClick = () => {
    onOpen()
    captureEvent("Click: Purchase (Requirement)", {
      guild: urlName,
    })
  }

  return (
    <>
      <Button
        colorScheme="blue"
        size="xs"
        leftIcon={<Icon as={ShoppingCartSimple} />}
        borderRadius="md"
        fontWeight="medium"
        onClick={onClick}
      >
        Purchase
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} colorScheme="duotone">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text as="span" mr={2}>
              Buy requirement
            </Text>
            <AlphaTag />
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <PurchasedRequirementInfo
              rightElement={
                isValidating ? (
                  <Spinner size="sm" />
                ) : (
                  <Text as="span">
                    {!isNaN(estimatedPriceInUSD)
                      ? `${
                          estimatedPriceInUSD < 0.01
                            ? "< $0.01"
                            : `$${estimatedPriceInUSD.toFixed(2)}`
                        }`
                      : ""}
                  </Text>
                )
              }
              footer={<BlockExplorerUrl />}
            />
          </ModalBody>

          <ModalFooter pt={10} flexDir="column">
            <PaymentMethodButtons />
            <ErrorCollapse error={error?.error} />

            <Stack spacing={8} w="full">
              <PaymentCurrencyPicker />
              <PurchaseFeeAndTotal />

              <Stack
                spacing={2}
                sx={{
                  ".chakra-collapse": {
                    overflow: "unset!important",
                    overflowX: "visible",
                    overflowY: "hidden",
                  },
                }}
              >
                {!account ? (
                  <ConnectWalletButton />
                ) : (
                  !error && (
                    <>
                      <SwitchNetworkButton
                        targetChainId={Chains[requirement.chain]}
                      />

                      <Collapse in={chainId === Chains[requirement.chain]}>
                        <TOSCheckbox>
                          {`I understand that I purchase from decentralized exchanges, not from ${name} or Guild.xyz itself`}
                        </TOSCheckbox>

                        <PurchaseAllowanceButton />
                      </Collapse>
                    </>
                  )
                )}
                <PurchaseButton />
              </Stack>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default PurchaseRequirement
