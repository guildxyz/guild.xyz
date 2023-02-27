import {
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react"
import SendDiscordJoinButtonModal from "components/[guild]/Onboarding/components/SummonMembers/components/SendDiscordJoinButtonModal"
import {
  ArrowsCounterClockwise,
  ChatDots,
  Check,
  DotsThree,
  Gear,
} from "phosphor-react"
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
      <Menu placement="bottom-end" closeOnSelect={false}>
        <MenuButton
          as={IconButton}
          icon={<DotsThree />}
          aria-label="Menu"
          boxSize={8}
          minW={8}
          rounded="full"
          colorScheme="alpha"
          data-dd-action-name="Discord card menu"
        />

        <MenuList>
          <MenuItem icon={<ChatDots />} onClick={onSendJoinButtonOpen}>
            Send join button
          </MenuItem>
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
            isDisabled={isLoading || response}
          >
            Sync members from Discord
          </MenuItem>
          <MenuItem icon={<Gear />} onClick={onSettingsOpen}>
            Settings
          </MenuItem>
          <MenuDivider />
          <MenuItem isDisabled>POAPs have moved into Add reward</MenuItem>
        </MenuList>
      </Menu>

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
