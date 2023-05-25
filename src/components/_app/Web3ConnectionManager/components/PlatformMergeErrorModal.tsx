import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  chakra,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import useConnectPlatform from "components/[guild]/JoinModal/hooks/useConnectPlatform"
import Button from "components/common/Button"
import Link from "components/common/Link"
import useToast from "hooks/useToast"
import platforms from "platforms/platforms"
import { PlatformName } from "types"
import capitalize from "utils/capitalize"
import shortenHex from "utils/shortenHex"

type Props = {
  isOpen: boolean
  onClose: () => void
  addressOrDomain: string
  platformName: PlatformName
}

const PlatformMergeErrorModal = ({
  isOpen,
  onClose,
  addressOrDomain,
  platformName,
}: Props) => {
  const { account } = useWeb3React()
  const toast = useToast()
  const socialAccountName = platforms[platformName]?.name ?? "social"
  const { onConnect, isLoading } = useConnectPlatform(
    platformName ?? "DISCORD",
    () => {
      toast({
        status: "success",
        title: "Recovered",
        description: `${capitalize(
          socialAccountName
        )} account successfully recovered!`,
      })
      onClose()
    },
    undefined,
    undefined,
    true
  )

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"lg"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {capitalize(socialAccountName)} account already connected
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody display={"flex"} flexDir={"column"} gap={5}>
          <Box>
            This {socialAccountName} account is already connected to this address:{" "}
            <chakra.span fontWeight={"bold"}>{addressOrDomain}</chakra.span>
          </Box>
          <Box>
            If you have control over the above address, you can switch to it, and
            link your current address ({account ? shortenHex(account) : ""}) to it by
            following{" "}
            <Link
              colorScheme="primary"
              target="_blank"
              href={
                "https://help.guild.xyz/en/articles/6947559-how-to-un-link-wallet-addresses"
              }
            >
              this guide
            </Link>
          </Box>
          In case you have lost control over the mentioned address, you can recover
          your {socialAccountName} account by clicking the recover button below
        </ModalBody>
        <ModalFooter display={"flex"} gap={4} mt="-4">
          <Button onClick={() => onClose()} variant="outline">
            Close
          </Button>
          <Button
            onClick={() => onConnect()}
            isLoading={isLoading}
            colorScheme="primary"
          >
            Recover
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default PlatformMergeErrorModal
