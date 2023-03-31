import {
  Alert,
  AlertDescription,
  AlertIcon,
  Collapse,
  HStack,
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
import PoapReward from "components/[guild]/CreatePoap/components/PoapReward"
import useAccess from "components/[guild]/hooks/useAccess"
import useGuild from "components/[guild]/hooks/useGuild"
import Reward from "components/[guild]/RoleCard/components/Reward"
import { Chains } from "connectors"
import { Coin, StarHalf } from "phosphor-react"
import { useEffect } from "react"
import { usePoap } from "requirements/Poap/hooks/usePoaps"
import { paymentSupportedChains } from "utils/guildCheckout/constants"
import AlphaTag from "./components/AlphaTag"
import BuyAllowanceButton from "./components/buttons/BuyAllowanceButton"
import BuyButton from "./components/buttons/BuyButton"
import SwitchNetworkButton from "./components/buttons/SwitchNetworkButton"
import BuyTotal from "./components/BuyTotal"
import {
  GuildCheckoutProvider,
  useGuildCheckoutContext,
} from "./components/GuildCheckoutContex"
import InfoModal from "./components/InfoModal"
import TransactionLink from "./components/InfoModal/components/TransactionLink"
import PaymentFeeCurrency from "./components/PaymentFeeCurrency"
import PaymentMethodButtons from "./components/PaymentMethodButtons"
import TOSCheckbox from "./components/TOSCheckbox"

const BuyPass = () => {
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
    setAgreeWithTOS,
  } = useGuildCheckoutContext()
  const { id, name, roles, poaps } = useGuild()
  const role = roles?.find((r) => r.id === requirement?.roleId)

  // temporary until POAPs are real roles
  const guildPoap = poaps?.find((p) => p.poapIdentifier === requirement?.poapId)
  const { poap } = usePoap(guildPoap?.fancyId)
  useEffect(() => {
    if (requirement?.poapId) setAgreeWithTOS(true)
  }, [requirement?.poapId])

  const { data: accessData, isLoading: isAccessLoading } = useAccess(
    requirement?.roleId
  )

  const userSatisfiesOtherRequirements = accessData?.requirements
    ?.filter((r) => r.requirementId !== requirement?.id)
    ?.every((r) => r.access)

  if (
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
        onClick={onOpen}
        data-dd-action-name="Pay (Requierment)"
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

            {poap ? (
              <PoapReward poap={poap} isExpired={false} isInteractive={false} />
            ) : (
              role?.rolePlatforms?.map((platform) => (
                <Reward
                  key={platform.guildPlatformId}
                  platform={platform}
                  role={role}
                />
              )) || (
                <HStack pt="3" spacing={0} alignItems={"flex-start"} opacity=".7">
                  <Icon as={StarHalf} boxSize={5} overflow="hidden" />
                  <Text px="2">
                    No auto-managed rewards. The owner might add some in the future
                    or reward you another way!
                  </Text>
                </HStack>
              )
            )}
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
                  {!guildPoap && (
                    <TOSCheckbox>
                      I understand that if the owner changes the requirements, I
                      could lose access.
                    </TOSCheckbox>
                  )}

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
            ? "Success"
            : txHash
            ? "Transaction is processing..."
            : `Buy ${name} pass`
        }
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
