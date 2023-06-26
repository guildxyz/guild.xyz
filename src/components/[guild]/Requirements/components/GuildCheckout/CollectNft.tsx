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
import useNftDetails from "components/[guild]/collect/hooks/useNftDetails"
import { Chain } from "connectors"
import AlphaTag from "./components/AlphaTag"
import { useGuildCheckoutContext } from "./components/GuildCheckoutContex"

type Props = {
  chain: Chain
  address: string
}

const CollectNft = ({ chain, address }: Props) => {
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
            <Stack w="full" spacing={6}>
              {/* TODO: generalized <CollectNFTFees /> */}
              {/* <MintGuildPinButton /> */}
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default CollectNft
