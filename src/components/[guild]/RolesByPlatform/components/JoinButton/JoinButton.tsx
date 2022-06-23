import { Box, Tooltip, useDisclosure } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import { useRouter } from "next/router"
import { useEffect } from "react"
import useAccess from "../../hooks/useAccess"
import useJoinSuccessToast from "./components/JoinModal/hooks/useJoinSuccessToast"
import JoinDiscordModal from "./components/JoinModal/JoinDiscordModal"
import JoinModal from "./components/JoinModal/JoinModal"
import JoinTelegramModal from "./components/JoinModal/JoinTelegramModal"
import { PlatformName } from "./platformsContent"

type Props = {
  platform: PlatformName
  roleIds: Array<number>
}

const styleProps = { h: 10, flexShrink: 0 }

const JoinButton = ({ platform, roleIds }: Props): JSX.Element => {
  const { isActive } = useWeb3React()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { hasAccess, isLoading } = useAccess(roleIds)

  useJoinSuccessToast(onClose, platform)
  const router = useRouter()

  useEffect(() => {
    if (hasAccess && router.query.discordId) onOpen()
  }, [hasAccess])

  if (!isActive)
    return (
      <Tooltip label="Wallet not connected" shouldWrapChildren>
        <Box bgColor="gray.700" borderRadius="xl">
          <Button
            {...styleProps}
            disabled
            data-dd-action-name="Join (wallet not connected)"
          >
            Join Guild to get roles
          </Button>
        </Box>
      </Tooltip>
    )

  if (isLoading) {
    return (
      <Box bgColor="gray.700" borderRadius="xl">
        <Button
          {...styleProps}
          isLoading
          loadingText="Checking access"
          data-dd-action-name="Checking access"
        />
      </Box>
    )
  }

  if (!hasAccess)
    return (
      <Tooltip label="You don't satisfy all requirements" shouldWrapChildren>
        <Box bgColor="gray.700" borderRadius="xl">
          <Button {...styleProps} disabled data-dd-action-name="No access">
            No access
          </Button>
        </Box>
      </Tooltip>
    )

  return (
    <Box bgColor="gray.700" borderRadius="xl">
      <Button
        {...styleProps}
        onClick={onOpen}
        colorScheme="green"
        data-dd-action-name="Join"
      >
        Join Guild to get roles
      </Button>
      {platform === "TELEGRAM" ? (
        <JoinTelegramModal {...{ isOpen, onClose }} />
      ) : platform === "DISCORD" ? (
        <JoinDiscordModal {...{ isOpen, onClose }} />
      ) : (
        <JoinModal {...{ isOpen, onClose }} />
      )}
    </Box>
  )
}

export default JoinButton
