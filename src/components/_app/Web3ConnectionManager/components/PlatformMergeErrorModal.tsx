import {
  Heading,
  Icon,
  ListItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  UnorderedList,
  chakra,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import useConnectPlatform from "components/[guild]/JoinModal/hooks/useConnectPlatform"
import Button from "components/common/Button"
import CopyableAddress from "components/common/CopyableAddress"
import Link from "components/common/Link"
import useToast from "hooks/useToast"
import { ArrowSquareOut } from "phosphor-react"
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
        title: "Successful connect",
        description: `${capitalize(
          socialAccountName
        )} account successfully disconnected from old address, and connected to this one`,
      })
      onClose()
    },
    undefined,
    undefined,
    true
  )

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {capitalize(socialAccountName)} account already connected
        </ModalHeader>
        <ModalBody>
          <Text>
            This {socialAccountName} account is already connected to this address:{" "}
            {addressOrDomain.startsWith("0x") ? (
              <CopyableAddress address={addressOrDomain} decimals={4} />
            ) : (
              <chakra.span fontWeight={"semibold"}>addressOrDomain</chakra.span>
            )}
          </Text>
          <Heading mt="8" mb="3" size="sm">
            You have two options to choose from:
          </Heading>
          <UnorderedList>
            <ListItem mb="2">
              <Text>
                Switch to the address above and link your current address (
                <chakra.span fontWeight={"semibold"}>
                  {account ? shortenHex(account) : ""}
                </chakra.span>
                ) to it by following{" "}
                <Link
                  colorScheme="blue"
                  target="_blank"
                  href={
                    "https://help.guild.xyz/en/articles/6947559-how-to-un-link-wallet-addresses"
                  }
                >
                  this guide
                  <Icon ml="1" as={ArrowSquareOut} />
                </Link>
              </Text>
            </ListItem>
            <ListItem>
              <Text>
                Continue connecting the account to the current address (it'll
                disconnect it from the above one, losing any accesses you had with
                that)
              </Text>
            </ListItem>
          </UnorderedList>
        </ModalBody>
        <ModalFooter display={"flex"} gap={2} mt="-4">
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button onClick={onConnect} isLoading={isLoading} colorScheme="red">
            Connect anyway
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default PlatformMergeErrorModal
