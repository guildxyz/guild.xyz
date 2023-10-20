import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useColorMode,
} from "@chakra-ui/react"
import { Chains } from "chains"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import { usePostHogContext } from "components/_app/PostHogProvider"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import dynamic from "next/dynamic"
import { useState } from "react"
import { useMintGuildPinContext } from "../MintGuildPinContext"
import AlphaTag from "../components/AlphaTag"
import GuildPinFees from "../components/GuildPinFees"
import GuildPinImage from "../components/GuildPinImage"
import GuildPinReward from "../components/GuildPinReward"
import TransactionStatusModal from "../components/TransactionStatusModal"
import OpenseaLink from "../components/TransactionStatusModal/components/OpenseaLink"
import MintGuildPinButton from "../components/buttons/MintGuildPinButton"
import SwitchNetworkButton from "../components/buttons/SwitchNetworkButton"

const DynamicActivateGuildPinModal = dynamic(
  () => import("./components/ActivateGuildPinModal")
)

const MintGuildPin = (): JSX.Element => {
  const { captureEvent } = usePostHogContext()
  const { urlName, guildPin } = useGuild()
  const { isAdmin } = useGuildPermission()

  /**
   * Storing the initial state here, since when we activate the pin, we update the
   * SWR cache too and the activate modal gets unmounted too early
   */
  const [initialIsActive] = useState(guildPin?.isActive)

  const { isOpen, onOpen, onClose, onActivateModalOpen } = useMintGuildPinContext()

  const { colorMode } = useColorMode()

  return (
    <>
      <Button
        onClick={() => {
          if (!guildPin?.isActive) {
            onActivateModalOpen()
          } else {
            onOpen()
            captureEvent("Click: Mint Guild Pin (GuildPinRewardCard)", {
              guild: urlName,
            })
          }
        }}
        variant="outline"
        borderColor={colorMode === "dark" ? "whiteAlpha.200" : "blackAlpha.200"}
        {...(colorMode === "light"
          ? {
              _hover: {
                bg: "blackAlpha.50",
              },
              _active: {
                bg: "blackAlpha.200",
              },
            }
          : {})}
      >
        {!guildPin?.isActive ? "Setup Guild Pin" : "Mint Guild Pin"}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} colorScheme="dark">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader pb={4} pr={16}>
            <Text as="span" mr={2}>
              Mint Guild Pin
            </Text>
            <AlphaTag />
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody pb="6">
            <GuildPinImage />
          </ModalBody>

          <ModalFooter flexDir="column">
            <Stack w="full" spacing={6}>
              <GuildPinFees />

              <Stack w="full" spacing={2}>
                <SwitchNetworkButton targetChainId={Chains[guildPin?.chain]} />
                <MintGuildPinButton />
              </Stack>

              <Text colorScheme="gray" fontSize="sm">
                This is a non-transferable token that has no financial value.
              </Text>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {!initialIsActive && isAdmin && <DynamicActivateGuildPinModal />}

      <TransactionStatusModal
        title="Mint Guild Pin"
        successTitle="Successful mint"
        successText="Successful transaction! Your Guild Pin NFT is now on chain!"
        successLinkComponent={<OpenseaLink />}
        errorComponent={<Text mb={4}>Couldn't mint Guild Pin</Text>}
        progressComponent={
          <>
            <Text fontWeight={"bold"} mb="2">
              You'll get:
            </Text>
            <GuildPinReward />
          </>
        }
        successComponent={
          <>
            <Text fontWeight={"bold"} mb="2">
              Your new asset:
            </Text>
            <GuildPinReward />
          </>
        }
      />
    </>
  )
}

export default MintGuildPin
