import {
  Box,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import LogicDivider from "components/[guild]/LogicDivider"
import useUser from "components/[guild]/hooks/useUser"
import { walletSelectorModalAtom } from "components/_app/Web3ConnectionManager/components/WalletSelectorModal"
import useWeb3ConnectionManager from "components/_app/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import { atom, useSetAtom } from "jotai"
import { Plus, SignOut } from "phosphor-react"
import { useState } from "react"
import { useWalletClient } from "wagmi"

export type AddressLinkParams = {
  userId?: number
  address?: `0x${string}`
}
export const addressLinkParamsAtom = atom<AddressLinkParams>({
  userId: undefined,
  address: undefined,
})

const LinkAddressButton = (props) => {
  const [isLoading, setIsLoading] = useState(false)
  const { id } = useUser()

  const { address, disconnect } = useWeb3ConnectionManager()

  const { data: walletClient } = useWalletClient()

  const { isOpen, onOpen, onClose } = useDisclosure()
  const setAddressLinkParams = useSetAtom(addressLinkParamsAtom)
  const setIsWalletSelectorModalOpen = useSetAtom(walletSelectorModalAtom)

  if (!id) return null

  const onClick = async () => {
    setIsLoading(true)
    onOpen()
    setAddressLinkParams({ userId: id, address })

    try {
      await walletClient.requestPermissions({ eth_accounts: {} })
    } catch {
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    onClose()
    setIsLoading(false)
  }

  const handleLogout = () => {
    handleClose()
    disconnect()

    setIsWalletSelectorModalOpen(true)
  }

  return (
    <>
      <Button
        leftIcon={<Plus />}
        size="sm"
        onClick={onClick}
        isLoading={isLoading}
        loadingText="Check your wallet"
        {...props}
      >
        Link address
      </Button>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>Link address</ModalHeader>
          <ModalBody>
            <Text mt="-3">
              Please switch to the account you want to link and connect with it in
              your wallet!
            </Text>
            <Box borderRadius={"lg"} overflow="hidden" mt="4" minH="448px">
              <video src="/videos/metamask-switch-account.webm" muted autoPlay loop>
                Your browser does not support the HTML5 video tag.
              </video>
            </Box>
            <LogicDivider logic="OR" my="1" />
            <Button onClick={handleLogout} w="full" rightIcon={<SignOut />}>
              Connect another wallet
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default LinkAddressButton
