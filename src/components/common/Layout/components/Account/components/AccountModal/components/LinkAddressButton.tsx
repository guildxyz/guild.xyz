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
import { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import LogicDivider from "components/[guild]/LogicDivider"
import useUser from "components/[guild]/hooks/useUser"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import { Plus, SignOut } from "phosphor-react"
import { useState } from "react"

const LinkAddressButton = (props) => {
  const [isLoading, setIsLoading] = useState(false)
  const { id } = useUser()
  const { provider, connector, account } = useWeb3React<Web3Provider>()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { openWalletSelectorModal, setAddressLinkParams } =
    useWeb3ConnectionManager()

  if (!id) return null

  const onClick = async () => {
    setIsLoading(true)
    onOpen()
    setAddressLinkParams({ userId: id, address: account })

    try {
      await provider.provider.request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }],
      })
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
    connector.resetState()
    connector.deactivate?.()
    openWalletSelectorModal()
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
