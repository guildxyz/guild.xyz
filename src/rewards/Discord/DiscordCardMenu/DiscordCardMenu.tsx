import { MenuDivider, MenuItem, useDisclosure } from "@chakra-ui/react"
import { ChatDots } from "@phosphor-icons/react/ChatDots"
import { Link } from "@phosphor-icons/react/Link"
import RemovePlatformMenuItem from "components/[guild]/AccessHub/components/RemovePlatformMenuItem"
import SendDiscordJoinButtonModal from "components/[guild]/Onboarding/components/SummonMembers/components/SendDiscordJoinButtonModal"
import PlatformCardMenu from "components/[guild]/RolePlatforms/components/PlatformCard/components/PlatformCardMenu"
import DiscordCaptchaSwitch from "./components/DiscordCaptchaSwitch"
import DiscordRewardSettings from "./components/DiscordRewardSettings.tsx"

type Props = {
  platformGuildId: string
}

const DiscordCardMenu = ({ platformGuildId }: Props): JSX.Element => {
  const {
    isOpen: isSendJoinButtonOpen,
    onOpen: onSendJoinButtonOpen,
    onClose: onSendJoinButtonClose,
  } = useDisclosure()
  const {
    isOpen: isSettingsOpen,
    onOpen: onSettingsOpen,
    onClose: onSettingsClose,
  } = useDisclosure()

  return (
    <>
      <PlatformCardMenu>
        <MenuItem icon={<ChatDots />} onClick={onSendJoinButtonOpen}>
          Send join button
        </MenuItem>
        <MenuItem icon={<Link />} onClick={onSettingsOpen}>
          Customize invite link
        </MenuItem>
        <RemovePlatformMenuItem platformGuildId={platformGuildId} />
        <MenuDivider />
        <DiscordCaptchaSwitch serverId={platformGuildId} />
      </PlatformCardMenu>

      <SendDiscordJoinButtonModal
        isOpen={isSendJoinButtonOpen}
        onClose={onSendJoinButtonClose}
        serverId={platformGuildId}
      />
      <DiscordRewardSettings
        isOpen={isSettingsOpen}
        onClose={onSettingsClose}
        serverId={platformGuildId}
      />
    </>
  )
}

export default DiscordCardMenu
