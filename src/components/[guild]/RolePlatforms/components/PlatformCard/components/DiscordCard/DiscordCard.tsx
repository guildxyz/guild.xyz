import { Button, Flex, useDisclosure, VStack } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import useServerData from "hooks/useServerData"
import { useRolePlatform } from "../../../RolePlatformProvider"
import PlatformCard from "../../PlatformCard"
import BaseLabel from "./components/BaseLabel"
import BaseModal from "./components/BaseModal"
import ChannelsToGate from "./components/ChannelsToGate"
import RoleToManage from "./components/RoleToManage"

const DiscordCard = ({ onRemove }) => {
  const { type, nativePlatformId, roleId } = useRolePlatform()
  const { roles } = useGuild()
  const role = roles?.find((r) => r.id === roleId)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const serverData = useServerData(
    (type === "DISCORD" && nativePlatformId) || undefined
  )

  const isNew = !roleId

  return (
    <PlatformCard
      colSpan={2}
      imageUrl={
        serverData?.data?.serverIcon || role?.imageUrl || "/default_discord_icon.png"
      }
      name={serverData?.data?.serverName || role?.name || ""}
      onRemove={onRemove}
    >
      <Flex
        flexDirection={{ base: "column", md: "row" }}
        alignItems={{ base: "stretch", md: "center" }}
      >
        {(isNew && <BaseLabel isAdded />) || <BaseLabel />}

        <Button
          size="sm"
          onClick={onOpen}
          ml={{ base: 0, md: 3 }}
          mt={{ base: 3, md: 0 }}
        >
          Edit
        </Button>

        <BaseModal {...{ isOpen, onClose }} minW={isNew ? { md: "xl" } : undefined}>
          {(isNew && (
            <VStack spacing={5} alignItems="start">
              <RoleToManage />
              <ChannelsToGate />
            </VStack>
          )) || <ChannelsToGate />}
        </BaseModal>
      </Flex>
    </PlatformCard>
  )
}

export default DiscordCard
