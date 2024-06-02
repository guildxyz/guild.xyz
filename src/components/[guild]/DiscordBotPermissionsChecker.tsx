import {
  ListItem,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  ToastId,
  UnorderedList,
  useDisclosure,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import DiscordRoleVideo from "components/common/DiscordRoleVideo"
import { Modal } from "components/common/Modal"
import { ActionToastOptions, useToastWithButton } from "hooks/useToast"
import { ArrowSquareOut, Info } from "phosphor-react"
import { useMemo, useRef, useState } from "react"
import useSWRImmutable from "swr/immutable"
import { PlatformType } from "types"
import fetcher from "utils/fetcher"
import useGuild from "./hooks/useGuild"
import useGuildPermission from "./hooks/useGuildPermission"

const MANAGE_ROLES_PERMISSION_NAME = "Manage Roles"
const MANAGE_SERVER_PERMISSION_NAME = "Manage Server"
const CREATE_INVITE_PERMISSION_NAME = "Create Invite"
const GUILD_BOT_ROLE_NAME = "Guild.xyz bot"
/**
 * If this list changes, make sure to replace the public/discord_permissions.png
 * image
 */
export const REQUIRED_PERMISSIONS = [
  MANAGE_ROLES_PERMISSION_NAME,
  "View Channels",
  MANAGE_SERVER_PERMISSION_NAME,
  CREATE_INVITE_PERMISSION_NAME,
  "Send Messages",
  "Embed Links",
  "Add Reactions",
  "Use External Emoji",
] as const

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
        <Stack spacing={2} mb={4}>
          <Text>
            Our bot requires the following permissions in order to function properly:
          </Text>
          <UnorderedList>
            {REQUIRED_PERMISSIONS.map((permission) => (
              <ListItem key={permission}>{permission}</ListItem>
            ))}
          </UnorderedList>
        </Stack>
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
        fetcher(`/v2/discord/servers/${gp.platformGuildId}/permissions`)
      )
    )

  const toastWithButton = useToastWithButton()
  const toastIdRef = useRef<ToastId>()

  useSWRImmutable<DiscordPermissions[]>(
    discordRewards.length > 0 && isAdmin ? ["discordPermissions", id] : null,
    fetchDiscordPermissions,
    {
      shouldRetryOnError: false,
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
          const {
            platformGuildName: serverName,
            platformGuildData: { invite },
          } = discordRewards[index]

          const permissionsNotGranted = Object.values(
            permissionInfo.permissions
          ).filter((perm) => !perm.value && perm.name !== "Administrator")

          if (
            // We always need the "Manage Roles" permissions
            permissionsNotGranted.find(
              (p) => p.name === MANAGE_ROLES_PERMISSION_NAME
            ) ||
            // We need the Manage Server & Create Invite permissions if there's no custom invite
            (!invite &&
              permissionsNotGranted.find(
                (p) =>
                  p.name === CREATE_INVITE_PERMISSION_NAME ||
                  p.name === MANAGE_SERVER_PERMISSION_NAME
              ))
          ) {
            toastIdRef.current = toastWithButton({
              title: "Missing permissions",
              description: `${permissionsNotGranted
                .map((perm) => perm.name)
                .join(", ")} permission${
                permissionsNotGranted.length > 1 ? "s are" : " is"
              } missing for the Guild.xyz bot on ${
                serverName ? `the ${serverName}` : "your"
              } Discord server.`,
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
      onError: () => {
        toastIdRef.current = toastWithButton({
          status: "warning",
          title: "Guild.xyz Discord bot is missing",
          description:
            "The Guild.xyz bot is not a member of your Discord server, so it won't be able to manage your roles.",
          duration: null,
          isClosable: false,
          buttonProps: {
            children: "Invite bot",
            rightIcon: <ArrowSquareOut />,
            onClick: () =>
              window.open(
                `https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&permissions=268716145&scope=bot%20applications.commands`
              ),
          },
          secondButtonProps: {
            children: "Later",
            variant: "ghost",
          },
        })
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
