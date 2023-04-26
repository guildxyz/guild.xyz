import {
  Alert,
  AlertDescription,
  AlertIcon,
  Collapse,
  Divider,
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
import Reward from "components/[guild]/RoleCard/components/Reward"
import useAccess from "components/[guild]/hooks/useAccess"
import useGuild from "components/[guild]/hooks/useGuild"
import { usePostHogContext } from "components/_app/PostHogProvider"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import { Chains } from "connectors"
import { Coin } from "phosphor-react"
import { paymentSupportedChains } from "utils/guildCheckout/constants"
import AlphaTag from "./components/AlphaTag"
import BuyTotal from "./components/BuyTotal"
import {
  GuildCheckoutProvider,
  useGuildCheckoutContext,
} from "./components/GuildCheckoutContex"
import InfoModal from "./components/InfoModal"
import TransactionLink from "./components/InfoModal/components/TransactionLink"
import NoReward from "./components/NoReward"
import PaymentFeeCurrency from "./components/PaymentFeeCurrency"
import PaymentMethodButtons from "./components/PaymentMethodButtons"
import TOSCheckbox from "./components/TOSCheckbox"
import BuyAllowanceButton from "./components/buttons/BuyAllowanceButton"
import BuyButton from "./components/buttons/BuyButton"
import SwitchNetworkButton from "./components/buttons/SwitchNetworkButton"

const BuyPass = () => {
  const { captureEvent } = usePostHogContext()

  const { featureFlags } = useGuild()

  const { account, chainId } = useWeb3React()
  const {
    requirement,
    isOpen,
    onOpen,
    onClose,
    isInfoModalOpen,
    txError,
    txSuccess,
    txHash,
  } = useGuildCheckoutContext()
  const { urlName, name, roles } = useGuild()
  const role = roles?.find((r) => r.id === requirement?.roleId)
  const { data: accessData, isLoading: isAccessLoading } = useAccess(
    requirement?.roleId
  )

  const userSatisfiesOtherRequirements = accessData?.requirements
    ?.filter((r) => r.requirementId !== requirement?.id)
    ?.every((r) => r.access)

  const onClick = () => {
    onOpen()
    captureEvent("Click: Buy (Requirement)", {
      guild: urlName,
    })
  }

  if (
    (!isInfoModalOpen && !featureFlags?.includes("PAYMENT_REQUIREMENT")) ||
    !account ||
    (!accessData && isAccessLoading) ||
    requirement?.type !== "PAYMENT" ||
    !paymentSupportedChains.includes(requirement?.chain)
  )
    return null

  return (
    <>
      <Button
        colorScheme="blue"
        size="sm"
        leftIcon={<Icon as={Coin} />}
        borderRadius="lg"
        fontWeight="medium"
        onClick={onClick}
      >
        Pay
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} colorScheme="duotone">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader pb={4} pr={16}>
            <Text as="span" mr={2}>{`Buy ${name} pass`}</Text>
            <AlphaTag />
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            {!userSatisfiesOtherRequirements && role?.logic === "AND" && (
              <Alert
                status="warning"
                bgColor="orange.100"
                color="black"
                mb="6"
                pb="5"
              >
                <AlertIcon color="orange.500" />
                <Stack>
                  <AlertDescription position="relative" top={1}>
                    There're other requirements you don't satisfy, so the pass alone
                    won't grant you access
                  </AlertDescription>
                </Stack>
              </Alert>
            )}

            {role?.rolePlatforms?.map((platform) => (
              <Reward
                key={platform.guildPlatformId}
                platform={platform}
                role={role}
              />
            )) || <NoReward />}
          </ModalBody>

          <ModalFooter pt={10} flexDir="column">
            <PaymentMethodButtons />

            <Stack spacing={8} w="full">
              <PaymentFeeCurrency />
              <BuyTotal />

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
                <SwitchNetworkButton />

                <Collapse in={chainId === Chains[requirement.chain]}>
                  <TOSCheckbox>
                    I understand that if the owner changes the requirements, I could
                    lose access.
                  </TOSCheckbox>

                  <BuyAllowanceButton />
                </Collapse>

                <BuyButton />
              </Stack>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <InfoModal
        title={
          txError
            ? "Transaction failed"
            : txSuccess
            ? "Successful payment"
            : txHash
            ? "Transaction is processing..."
            : `Buy ${name} pass`
        }
        progressComponent={
          <>
            <Text mb={2}>
              The blockchain is working its magic... Your transaction should be
              confirmed shortly
            </Text>

            <TransactionLink />

            <Divider mb="6" />

            <Text fontWeight={"bold"} mb="2">
              Unlocking rewards...
            </Text>
            {role?.rolePlatforms?.map((platform) => (
              <Reward
                key={platform.guildPlatformId}
                platform={platform}
                role={role}
                withLink
              />
            )) || <NoReward />}
          </>
        }
        successComponent={
          <>
            <Text mb={2}>
              Successful transaction! Your access is being rechecked.
            </Text>

            <TransactionLink />

            <Divider mb="6" />

            <Text fontWeight={"bold"} mb="2">
              Unlocked rewards:
            </Text>
            {role?.rolePlatforms?.map((platform) => (
              <Reward
                key={platform.guildPlatformId}
                platform={platform}
                role={role}
                withLink
                isLinkColorful
              />
            )) || <NoReward />}
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
