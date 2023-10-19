import {
  Alert,
  AlertDescription,
  AlertIcon,
  Collapse,
  Icon,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react"
import PoapReward from "components/[guild]/CreatePoap/components/PoapReward"
import Reward from "components/[guild]/RoleCard/components/Reward"
import useAccess from "components/[guild]/hooks/useAccess"
import useGuild from "components/[guild]/hooks/useGuild"
import { usePostHogContext } from "components/_app/PostHogProvider"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import { Chains } from "connectors"
import { Coin } from "phosphor-react"
import { useEffect } from "react"
import { usePoap } from "requirements/Poap/hooks/usePoaps"
import { paymentSupportedChains } from "utils/guildCheckout/constants"
import { useAccount, useChainId } from "wagmi"
import { useRequirementContext } from "../RequirementContext"
import BuyTotal from "./components/BuyTotal"
import { useGuildCheckoutContext } from "./components/GuildCheckoutContex"
import NoReward from "./components/NoReward"
import PaymentFeeCurrency from "./components/PaymentFeeCurrency"
import PaymentMethodButtons from "./components/PaymentMethodButtons"
import TOSCheckbox from "./components/TOSCheckbox"
import BuyAllowanceButton from "./components/buttons/BuyAllowanceButton"
import BuyButton from "./components/buttons/BuyButton"
import SwitchNetworkButton from "./components/buttons/SwitchNetworkButton"

const BuyPass = () => {
  const { captureEvent } = usePostHogContext()

  const { address } = useAccount()
  const chainId = useChainId()
  const requirement = useRequirementContext()
  const { isOpen, onOpen, onClose, setAgreeWithTOS } = useGuildCheckoutContext()
  const { urlName, name, roles, poaps } = useGuild()
  const role = roles?.find((r) => r.id === requirement?.roleId)

  // temporary until POAPs are real roles
  const guildPoap = poaps?.find((p) => p.poapIdentifier === requirement?.poapId)
  const { poap } = usePoap(guildPoap?.fancyId)
  useEffect(() => {
    if (requirement?.poapId) setAgreeWithTOS(true)
  }, [requirement?.poapId])

  const { data: accessData, isValidating: isAccessValidating } = useAccess(
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
    !address ||
    (!accessData && isAccessValidating) ||
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
            {`Buy ${name} pass`}
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
              <PoapReward poap={poap} isInteractive={false} />
            ) : (
              role?.rolePlatforms?.map((platform) => (
                <Reward
                  key={platform.guildPlatformId}
                  platform={platform}
                  role={role}
                />
              )) || <NoReward />
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
                <SwitchNetworkButton targetChainId={Chains[requirement.chain]} />

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
    </>
  )
}

export default BuyPass
