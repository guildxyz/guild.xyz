import {
  Collapse,
  Icon,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import useAccess from "components/[guild]/hooks/useAccess"
import useGuild from "components/[guild]/hooks/useGuild"
import Reward from "components/[guild]/RoleCard/components/Reward"
import { Chains } from "connectors"
import { Coin } from "phosphor-react"
import {
  paymentSupportedChains,
  PAYMENT_ALLOWED_GUILDS,
} from "utils/guildCheckout/constants"
import AlphaTag from "./components/AlphaTag"
import BuyButton from "./components/buttons/BuyButton"
import BuyPassAllowanceButton from "./components/buttons/BuyPassAllowanceButton"
import SwitchNetworkButton from "./components/buttons/SwitchNetworkButton"
import {
  GuildCheckoutProvider,
  useGuildCheckoutContext,
} from "./components/GuildCheckoutContex"
import InfoModal from "./components/InfoModal"
import TransactionLink from "./components/InfoModal/components/TransactionLink"
import PaymentFeeAndTotal from "./components/PaymentFeeAndTotal"
import PaymentFeeCurrency from "./components/PaymentFeeCurrency"
import PaymentModeButtons from "./components/PaymentModeButtons"
import TOSCheckbox from "./components/TOSCheckbox"

const BuyPass = () => {
  const { account, chainId } = useWeb3React()
  const { requirement, isOpen, onOpen, onClose, isInfoModalOpen } =
    useGuildCheckoutContext()
  const { id, name, roles } = useGuild()
  const role = roles?.find((r) => r.id === requirement?.roleId)
  const { data: accessData, isLoading: isAccessLoading } = useAccess(
    requirement?.roleId
  )
  const satisfiesRequirement = accessData?.requirements?.find(
    (req) => req.requirementId === requirement.id
  )?.access

  if (
    !isInfoModalOpen &&
    // TODO: we'll be able to control this properly once we'll have feature flags
    (!PAYMENT_ALLOWED_GUILDS.includes(id) ||
      !account ||
      (!accessData && isAccessLoading) ||
      satisfiesRequirement ||
      requirement?.type !== "PAYMENT" ||
      !paymentSupportedChains.includes(requirement?.chain))
  )
    return null

  return (
    <>
      <Button
        colorScheme="blue"
        size="xs"
        leftIcon={<Icon as={Coin} />}
        borderRadius="md"
        fontWeight="medium"
        onClick={onOpen}
        data-dd-action-name="Pay (Requierment)"
      >
        Pay
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} colorScheme="duotone">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader pb={4}>
            <Text as="span">{`Buy ${name} pass`}</Text>
            <AlphaTag />
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            {role.rolePlatforms?.map((platform) => (
              <Reward
                key={platform.guildPlatformId}
                platform={platform}
                role={role}
              />
            ))}
          </ModalBody>

          <ModalFooter pt={10} flexDir="column">
            <PaymentModeButtons />

            <Stack spacing={8} w="full">
              <PaymentFeeCurrency />
              <PaymentFeeAndTotal />

              <Stack spacing={2}>
                <SwitchNetworkButton />

                <Collapse in={chainId === Chains[requirement.chain]}>
                  <TOSCheckbox>
                    I understand that if the owner changes requirements, I could lose
                    access.
                  </TOSCheckbox>

                  <BuyPassAllowanceButton />
                </Collapse>

                <BuyButton />
              </Stack>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <InfoModal
        progressComponent={
          <>
            <Text mb={4}>
              The blockchain is working its magic... Your transaction should be
              confirmed shortly
            </Text>

            <TransactionLink />
          </>
        }
        successComponent={
          <>
            <Text mb={4}>
              Successful transaction! Your access is being rechecked.
            </Text>

            <TransactionLink />
          </>
        }
        errorComponent={
          <>
            <Text mb={4}>{`Couldn't buy ${name} pass`}</Text>
          </>
        }
      />
    </>
  )
}

const BuyPassWrapper = () => (
  <GuildCheckoutProvider>
    <BuyPass />
  </GuildCheckoutProvider>
)

export default BuyPassWrapper
