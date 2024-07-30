import { usePostHogContext } from "@/components/Providers/PostHogProvider"
import { Img, Skeleton, Stack, Text, VStack } from "@chakra-ui/react"
import Button from "components/common/Button"
import Card from "components/common/Card"
import DiscordRoleVideo from "components/common/DiscordRoleVideo"
import { env } from "env"
import useCountdownSeconds from "hooks/useCountdownSeconds"
import usePopupWindow from "hooks/usePopupWindow"
import useServerPermissions from "hooks/useServerPermissions"
import useSubmit from "hooks/useSubmit"

type Props = {
  onSubmit?: () => void
  serverId: string
}

const ServerSetupCard = ({ onSubmit, serverId }: Props): JSX.Element => {
  const { captureEvent } = usePostHogContext()

  const { seconds, start, isCountingDown } = useCountdownSeconds(5)

  const { permissions, isValidating, mutate } = useServerPermissions(serverId)

  const isBotAdded = !!permissions

  const revalidatePermissions = useSubmit(() =>
    mutate().then((newPermissions) => {
      if (newPermissions?.hasAllPermissions && newPermissions?.isRoleOrderOk) {
        onSubmit?.()
      }
      return newPermissions
    })
  )

  const { onOpen: openAddBotPopup, windowInstance } = usePopupWindow(
    `https://discord.com/api/oauth2/authorize?client_id=${env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&guild_id=${serverId}&permissions=268716145&scope=bot%20applications.commands`,
    undefined,
    () => revalidatePermissions.onSubmit()
  )

  const isBotAddPopupOpen = !!windowInstance

  return (
    <Skeleton
      isLoaded={!isValidating && !revalidatePermissions.isLoading}
      borderRadius={"2xl"}
    >
      <Card px={{ base: 5, sm: 6 }} py={7}>
        <Stack spacing={8}>
          {!isBotAdded ? (
            <Text>
              Please add the <strong>Guild.xyz</strong> bot to your server
            </Text>
          ) : !permissions?.hasAllPermissions ? (
            <VStack>
              <Text>
                Please grant all requested permissions for the{" "}
                <strong>Guild.xyz</strong> bot
              </Text>
              <Img
                borderRadius={"md"}
                shadow={"md"}
                src="/discord_permissions.png"
                alt="Image showing all the granted Discord bot permissions"
              />
            </VStack>
          ) : !permissions?.isRoleOrderOk ? (
            <DiscordRoleVideo />
          ) : null}

          {!isBotAdded || !permissions?.hasAllPermissions ? (
            <Button
              colorScheme="DISCORD"
              isLoading={isBotAddPopupOpen}
              loadingText={"Complete Discord Popup"}
              onClick={() => {
                captureEvent("[discord setup] opening add bot modal", { isBotAdded })
                openAddBotPopup()
              }}
            >
              {!isBotAdded ? "Add bot" : "Grant permissions"}
            </Button>
          ) : !permissions?.isRoleOrderOk ? (
            <Button
              isDisabled={isCountingDown}
              colorScheme="DISCORD"
              onClick={() => {
                captureEvent("[discord setup] rechecking role order")
                revalidatePermissions.onSubmit().then((res) => {
                  if (!res?.isRoleOrderOk) {
                    start()
                  }
                })
              }}
            >
              {isCountingDown ? `Try again in ${seconds}` : "Recheck order"}
            </Button>
          ) : (
            onSubmit && (
              <Button colorScheme="green" onClick={onSubmit}>
                Got it
              </Button>
            )
          )}
        </Stack>
      </Card>
    </Skeleton>
  )
}

export default ServerSetupCard
