import {
  MenuDivider,
  MenuItem,
  Spinner,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react"
import RemovePlatformMenuItem from "components/[guild]/AccessHub/components/RemovePlatformMenuItem"
import SendDiscordJoinButtonModal from "components/[guild]/Onboarding/components/SummonMembers/components/SendDiscordJoinButtonModal"
import PlatformCardMenu from "components/[guild]/RolePlatforms/components/PlatformCard/components/PlatformCardMenu"
import { ArrowsCounterClockwise, ChatDots, Check, Gear } from "phosphor-react"
import DiscordCaptchaSwitch from "./components/DiscordCaptchaSwitch"
import DiscordRewardSettings from "./components/DiscordRewardSettings.tsx"
import useSyncMembersFromDiscord from "./hooks/useSyncMembersFromDiscord"

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

  const { response, isLoading, triggerSync } = useSyncMembersFromDiscord()

  return (
    <>
      <PlatformCardMenu>
        <MenuItem icon={<ChatDots />} onClick={onSendJoinButtonOpen}>
          Send join button
        </MenuItem>
        <Tooltip label="Temporarily disabled" placement="right" hasArrow>
          <MenuItem
            icon={
              response ? (
                <Check />
              ) : isLoading ? (
                <Spinner boxSize="1em" mb="-2px" />
              ) : (
                <ArrowsCounterClockwise />
              )
            }
            onClick={triggerSync}
            // isDisabled={isLoading || response}
            isDisabled={true}
          >
            Sync members from Discord
          </MenuItem>
        </Tooltip>
        <MenuItem icon={<Gear />} onClick={onSettingsOpen}>
          Settings
        </MenuItem>
        <RemovePlatformMenuItem platformGuildId={platformGuildId} />
        <MenuDivider />
        <DiscordCaptchaSwitch serverId={platformGuildId} />
        <MenuDivider />
        <MenuItem isDisabled fontSize="sm">
          POAPs have moved into Add reward
        </MenuItem>
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
