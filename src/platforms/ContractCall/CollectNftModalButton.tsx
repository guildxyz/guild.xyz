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
import CollectNftFeesTable from "components/[guild]/collect/components/CollectNftFeesTable"
import CollectibleImage from "components/[guild]/collect/components/CollectibleImage"
import useNftDetails from "components/[guild]/collect/hooks/useNftDetails"
import useGuild from "components/[guild]/hooks/useGuild"
import { usePostHogContext } from "components/_app/PostHogProvider"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import { Chains } from "connectors"
import { ContractCallRewardIcon } from "platforms/ContractCall/ContractCallReward"
import AlphaTag from "../../components/[guild]/Requirements/components/GuildCheckout/components/AlphaTag"
import { useGuildCheckoutContext } from "../../components/[guild]/Requirements/components/GuildCheckout/components/GuildCheckoutContex"
import TransactionStatusModal from "../../components/[guild]/Requirements/components/GuildCheckout/components/TransactionStatusModal"
import OpenseaLink from "../../components/[guild]/Requirements/components/GuildCheckout/components/TransactionStatusModal/components/OpenseaLink"
import SwitchNetworkButton from "../../components/[guild]/Requirements/components/GuildCheckout/components/buttons/SwitchNetworkButton"
import CollectNftButton from "../../components/[guild]/collect/components/CollectNftButton"
import { useCollectNftContext } from "../../components/[guild]/collect/components/CollectNftContext"

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

      {/**
       * TODO: it doesn't appear now because we don't set states for the
       * GuildCheckoutContext. Should make it work and also it would be great to add it to
       * the collect page too
       */}
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
