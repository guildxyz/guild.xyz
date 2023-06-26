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
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import CollectibleImage from "components/[guild]/collect/components/CollectibleImage"
import CollectNftFeesTable from "components/[guild]/collect/components/CollectNftFeesTable"
import useNftDetails from "components/[guild]/collect/hooks/useNftDetails"
import { Chains } from "connectors"
import AlphaTag from "./components/AlphaTag"
import CollectNftButton from "./components/buttons/CollectNftButton"
import SwitchNetworkButton from "./components/buttons/SwitchNetworkButton"
import { useCollectNftContext } from "./components/CollectNftContext"
import { useGuildCheckoutContext } from "./components/GuildCheckoutContex"

const CollectNft = () => {
  const { chain, address } = useCollectNftContext()
  const { isOpen, onOpen, onClose } = useGuildCheckoutContext()
  const { data, isValidating } = useNftDetails(chain, address)

  return (
    <>
      <Button
        colorScheme="cyan"
        onClick={() => {
          onOpen()
          // captureEvent("Click: Mint Guild Pin (GuildPinRewardCard)", {
          //   guild: urlName,
          // })
        }}
      >
        Collect NFT
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} colorScheme="dark">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader pb={4} pr={16}>
            <Text as="span" mr={2}>
              {`Collect ${data?.name ?? "NFT"}`}
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
          </ModalBody>

          <ModalFooter flexDir="column">
            <Stack w="full" spacing={2}>
              <CollectNftFeesTable />
              <SwitchNetworkButton targetChainId={Chains[chain]} />
              <CollectNftButton />
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default CollectNft
