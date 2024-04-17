import {
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  ToastId,
  useDisclosure,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import DiscordRoleVideo from "components/common/DiscordRoleVideo"
import { Modal } from "components/common/Modal"
import { ActionToastOptions, useToastWithButton } from "hooks/useToast"
import { Info } from "phosphor-react"
import { useMemo, useRef, useState } from "react"
import useSWRImmutable from "swr/immutable"
import { PlatformType } from "types"
import fetcher from "utils/fetcher"
import useGuild from "./hooks/useGuild"
import useGuildPermission from "./hooks/useGuildPermission"

const GUILD_BOT_ROLE_NAME = "Guild.xyz bot"
/**
 * Mapping permission names which we get from our backend to actual permission names
 * which the user will be able to find on Discord
 */
const REQUIRED_PERMISSIONS = [
  "View Channels",
  "Manage Roles",
  "Create Invite",
  "Send Messages",
  "Embed Links",
  "Add Reactions",
  "Use External Emoji",
  "Read Message History",
]

type DiscordPermissions = {
  permissions: Record<
    string,
    {
      name: string
      value: boolean
    }
  >
  roleOrders: {
    discordRoleId: string
    roleName: string
    rolePosition: number
  }[]
}

type PermissionModalType = "PERMISSIONS" | "NAME" | "ROLE_ORDER"

const MODAL_CONTENT: Record<
  PermissionModalType,
  {
    title: string
    body: JSX.Element
  }
> = {
  PERMISSIONS: {
    title: "Setup bot permissions",
    body: (
      <>
        <Text>
          {`Our bot requires the ${REQUIRED_PERMISSIONS.join(
            ", "
          )} permissions in order to funcion properly`}
        </Text>
        <video src="/videos/dc-bot-permissions.webm" muted autoPlay loop>
          Your browser does not support the HTML5 video tag.
        </video>
      </>
    ),
  },
  ROLE_ORDER: {
    title: "Move the Guild.xyz bot role",
    body: <DiscordRoleVideo />,
  },
  NAME: {
    title: "Keep the Guild.xyz bot role name",
    body: (
      <Text>
        Seems like you've changed our bot role's name on your Discord server. It
        might not work properly unless you keep its original name (
        <i>Guild.xyz bot</i>).
      </Text>
    ),
  },
}

const DiscordBotPermissionsChecker = () => {
  const { isAdmin } = useGuildPermission()
  const { id, guildPlatforms, roles } = useGuild()
  const discordRewards = useMemo(
    () =>
      guildPlatforms?.filter((gp) => gp.platformId === PlatformType.DISCORD) ?? [],
    [guildPlatforms]
  )

  const [errorType, setErrorType] = useState<PermissionModalType>()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const fetchDiscordPermissions = () =>
    Promise.all(
      discordRewards?.map((gp) =>
        fetcher(`/discord/permissions/${gp.platformGuildId}`)
      )
    )

  const toastWithButton = useToastWithButton()
  const toastIdRef = useRef<ToastId>()

  useSWRImmutable<DiscordPermissions[]>(
    discordRewards.length > 0 && isAdmin ? ["discordPermissions", id] : null,
    fetchDiscordPermissions,
    {
      onSuccess: (data, _key, _config) => {
        if (!!toastIdRef.current) return

        const toastOptions: ActionToastOptions = {
          status: "warning",
          duration: null,
          isClosable: false,
          buttonProps: {
            children: "Fix problem",
            leftIcon: <Info />,
            onClick: onOpen,
          },
          secondButtonProps: {
            children: "Later",
            variant: "ghost",
          },
        }

        for (const [index, permissionInfo] of data.entries()) {
          const serverName = discordRewards[index].platformGuildName

          const permissionsNotGranted = Object.values(
            permissionInfo.permissions
          ).filter((perm) => !perm.value && perm.name !== "Administrator")

          if (permissionsNotGranted.length > 0) {
            toastIdRef.current = toastWithButton({
              title: "Missing permissions",
              description: `We've noticed that the Guild.xyz bot is missing the following permissions on the ${serverName} Discord server: ${permissionsNotGranted
                .map((perm) => perm.name)
                .join(", ")}`,
              ...toastOptions,
            })
            setErrorType("PERMISSIONS")
            return
          }

          const discordBotsRole = permissionInfo.roleOrders.find(
            (role) => role.roleName === GUILD_BOT_ROLE_NAME
          )

          if (!discordBotsRole) {
            toastIdRef.current = toastWithButton({
              title: "Guild.xyz Discord bot is misconfigured",
              description: `Seems like you've changed our bot's role name on the ${serverName} Discord server. It might not work properly unless you keep its original name.`,
              ...toastOptions,
            })
            setErrorType("NAME")
            return
          }

          const discordRewardIds = discordRewards.map((gp) => gp.id)
          const relevantDiscordRoles =
            roles
              ?.filter((role) =>
                role.rolePlatforms.some((rp) =>
                  discordRewardIds.includes(rp.guildPlatformId)
                )
              )
              .flatMap((role) => role.rolePlatforms)
              .map((rp) => rp.platformRoleId) ?? []
          const rolesWithInvalidPosition = permissionInfo.roleOrders.filter(
            (r) =>
              relevantDiscordRoles.includes(r.discordRoleId) &&
              r.rolePosition > discordBotsRole.rolePosition
          )

          if (rolesWithInvalidPosition.length > 0) {
            toastIdRef.current = toastWithButton({
              title: "Guild.xyz Discord bot is misconfigured",
              description: `Our bot won't be able to assign the following roles to your members on the ${serverName} Discord server, since they're above the Guild.xyz bot role: ${rolesWithInvalidPosition
                .map((r) => r.roleName)
                .join(", ")}`,
              ...toastOptions,
            })
            setErrorType("ROLE_ORDER")
          }
        }
      },
    }
  )

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader pb={4}>
          {MODAL_CONTENT[errorType]?.title ?? "Discord bot error"}
        </ModalHeader>

        <ModalBody>
          <Stack spacing={4}>
            {MODAL_CONTENT[errorType]?.body ?? <Text>Unknown error</Text>}
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button size="lg" w="full" colorScheme="green" onClick={onClose}>
            Done
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default DiscordBotPermissionsChecker
