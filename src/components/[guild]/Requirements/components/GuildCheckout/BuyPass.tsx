import {
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
import useAccess from "components/[guild]/hooks/useAccess"
import useGuild from "components/[guild]/hooks/useGuild"
import Reward from "components/[guild]/RoleCard/components/Reward"
import { Coin } from "phosphor-react"
import {
  paymentSupportedChains,
  PAYMENT_ALLOWED_GUILDS,
} from "utils/guildCheckout/constants"
import AlphaTag from "./components/AlphaTag"
import {
  GuildCheckoutProvider,
  useGuildCheckoutContext,
} from "./components/GuildCheckoutContex"
import PaymentFeeCurrency from "./components/PaymentFeeCurrency"
import PaymentModeButtons from "./components/PaymentModeButtons"

const BuyPass = () => {
  const { account } = useWeb3React()
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
            <HStack>
              <Text as="span">{`Buy ${name} pass`}</Text>
              <AlphaTag />
            </HStack>
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
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

const BuyPassWrapper = () => (
  <GuildCheckoutProvider>
    <BuyPass />
  </GuildCheckoutProvider>
)

export default BuyPassWrapper
