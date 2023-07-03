import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react"
import { ContractCallRewardIcon } from "components/[guild]/RoleCard/components/Reward/components/ContractCallReward"
import CollectNftFeesTable from "components/[guild]/collect/components/CollectNftFeesTable"
import CollectibleImage from "components/[guild]/collect/components/CollectibleImage"
import useNftDetails from "components/[guild]/collect/hooks/useNftDetails"
import useGuild from "components/[guild]/hooks/useGuild"
import { usePostHogContext } from "components/_app/PostHogProvider"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import { Chains } from "connectors"
import AlphaTag from "./components/AlphaTag"
import { useCollectNftContext } from "./components/CollectNftContext"
import { useGuildCheckoutContext } from "./components/GuildCheckoutContex"
import TransactionStatusModal from "./components/TransactionStatusModal"
import OpenseaLink from "./components/TransactionStatusModal/components/OpenseaLink"
import CollectNftButton from "./components/buttons/CollectNftButton"
import SwitchNetworkButton from "./components/buttons/SwitchNetworkButton"

const CollectNftModalButton = () => {
  const { captureEvent } = usePostHogContext()
  const { urlName } = useGuild()

  const { chain, address, alreadyCollected, guildPlatform, rolePlatformId } =
    useCollectNftContext()
  const { isOpen, onOpen, onClose } = useGuildCheckoutContext()
  const { data, isValidating } = useNftDetails(chain, address)

  const modalTitle = `Collect ${data?.name ?? "NFT"}`

  return (
    <>
      <Button
        colorScheme="cyan"
        onClick={() => {
          onOpen()
          captureEvent("Click: Collect NFT (ContractCallReward)", {
            guild: urlName,
          })
        }}
      >
        Collect NFT
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} colorScheme="dark">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader pb={4} pr={16}>
            <Text as="span" mr={2}>
              {modalTitle}
            </Text>
            <AlphaTag />
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody pb="6">
            <CollectibleImage
              src={data?.image}
              isLoading={isValidating}
              borderRadius="xl"
            />
            {data?.description && (
              <Text textAlign="center" fontWeight="medium" p="4">
                {data.description}
              </Text>
            )}
          </ModalBody>

          <ModalFooter flexDir="column">
            <Stack w="full" spacing={2}>
              <CollectNftFeesTable />
              {typeof alreadyCollected !== "undefined" && !alreadyCollected && (
                <SwitchNetworkButton targetChainId={Chains[chain]} />
              )}
              <CollectNftButton />
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <TransactionStatusModal
        title={modalTitle}
        successTitle="Successful mint"
        successText="Successful transaction!"
        successLinkComponent={<OpenseaLink />}
        errorComponent={<Text mb={4}>Couldn't mint NFT</Text>}
        progressComponent={
          <>
            <Text fontWeight={"bold"} mb="2">
              You'll get:
            </Text>
            <ContractCallRewardIcon {...{ guildPlatform, rolePlatformId }} />
          </>
        }
        successComponent={
          <>
            <Text fontWeight={"bold"} mb="2">
              Your new asset:
            </Text>
            <ContractCallRewardIcon {...{ guildPlatform, rolePlatformId }} />
          </>
        }
      />
    </>
  )
}

export default CollectNftModalButton
