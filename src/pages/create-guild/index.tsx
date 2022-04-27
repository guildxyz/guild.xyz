import { ChakraProps, Grid, usePrevious } from "@chakra-ui/react"
import { WithRumComponentContext } from "@datadog/rum-react-integration"
import Button from "components/common/Button"
import Layout from "components/common/Layout"
import useDCAuth from "components/[guild]/RolesByPlatform/components/JoinButton/components/JoinModal/hooks/useDCAuth"
import Link from "next/link"
import { useRouter } from "next/router"
import { DiscordLogo, TelegramLogo } from "phosphor-react"
import { useEffect, useMemo } from "react"

const commonButtonProps = {
  size: "lg",
  margin: 5,
  variant: "outline",
  paddingY: 10,
  fontWeight: "bold",
} as ChakraProps

const CreateGuildPage = (): JSX.Element => {
  const router = useRouter()
  const { onOpen, isAuthenticating, authToken } = useDCAuth("guilds")

  const prevAuthToken = usePrevious(authToken)

  const platforms = useMemo(
    () => [
      {
        path: "discord",
        label: "Discord",
        Icon: DiscordLogo,
        buttonProps: {
          ...commonButtonProps,
          colorScheme: "DISCORD",
          onClick: authToken ? undefined : onOpen,
          isLoading: isAuthenticating,
          loadingText: "Check the popup window",
          isDisabled: isAuthenticating,
        },
      },
      {
        path: "telegram",
        label: "Telegram",
        Icon: TelegramLogo,
        buttonProps: {
          ...commonButtonProps,
          colorScheme: "TELEGRAM",
        },
      },
    ],
    [authToken, onOpen, isAuthenticating]
  )

  useEffect(() => {
    if (!router.isReady) return
    if (!!prevAuthToken || !authToken) return

    router.push(
      { pathname: "/create-guild/discord", query: { authToken } },
      "/create-guild/discord"
    )
  }, [authToken, prevAuthToken, router])

  return (
    <Layout title="Choose a Realm">
      <Grid templateColumns={"repeat(2, 1fr)"}>
        {platforms.map(({ path, label, Icon, buttonProps }) =>
          "onClick" in buttonProps ? (
            <Button leftIcon={<Icon />} {...buttonProps}>
              {label}
            </Button>
          ) : (
            <Link key={path} href={`/create-guild/${path}`} passHref>
              <Button as="a" leftIcon={<Icon />} {...buttonProps}>
                {label}
              </Button>
            </Link>
          )
        )}
      </Grid>
    </Layout>
  )
}

export default WithRumComponentContext("Create guild index page", CreateGuildPage)
