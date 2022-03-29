import { Box, Button, Center, Heading, Spinner, Text } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import useUpdateUser from "components/common/Layout/components/Account/components/AccountModal/hooks/useUpdateUser"
import useCreateUser from "components/dcauth/hooks/useCreateUser"
import useUser from "components/[guild]/hooks/useUser"
import processDiscordError from "components/[guild]/RolesByPlatform/components/JoinButton/components/JoinModal/utils/processDiscordError"
import { Web3Connection } from "components/_app/Web3ConnectionManager"
import { useRouter } from "next/dist/client/router"
import { useContext, useEffect, useState } from "react"
import newNamedError from "utils/newNamedError"

const fetchUserID = async (
  tokenType: string,
  accessToken: string
): Promise<string> => {
  const response = await fetch("https://discord.com/api/users/@me", {
    headers: {
      authorization: `${tokenType} ${accessToken}`,
    },
  }).catch(() => {
    throw newNamedError(
      "Network error",
      "Unable to connect to Discord server. If you're using some tracking blocker extension, please try turning that off"
    )
  })

  if (!response.ok)
    throw newNamedError(
      "Discord error",
      "There was an error, while fetching the user data"
    )

  const { id } = await response.json()
  return id
}

const DCAuth = () => {
  const router = useRouter()
  const { account } = useWeb3React()
  const [id, setId] = useState<string>()
  const [urlNameFromState, setUrlNameFromState] = useState<string>("")
  const [discordError, setDiscordError] = useState<{
    title: string
    description: string
  }>({ title: undefined, description: undefined })
  const { openWalletSelectorModal } = useContext(Web3Connection)
  const [canAccessOpener, setCanAccessOpener] = useState<boolean>(undefined)

  const user = useUser()

  useEffect(() => {
    setCanAccessOpener(!!window.opener)
  }, [])

  const {
    response: createResponse,
    isLoading: isCreateLoading,
    onSubmit: onCreateSubmit,
    error: createError,
  } = useCreateUser()

  const {
    response: updateResponse,
    isLoading: isUpdateLoading,
    onSubmit: onUpdateSubmit,
    isSigning: isUpdateSigning,
    error: updateError,
  } = useUpdateUser()

  useEffect(() => {
    if (createResponse) {
      onUpdateSubmit({ discordId: id })
    }
  }, [createResponse])

  useEffect(() => {
    if (!router.isReady) return

    // We navigate to the index page if the dcauth page is used incorrectly
    // For example if someone just manually goes to /dcauth
    if (!window.location.hash) router.push("/")
    const fragment = new URLSearchParams(window.location.hash.slice(1))

    if (
      !fragment.has("state") ||
      ((!fragment.has("access_token") || !fragment.has("token_type")) &&
        (!fragment.has("error") || !fragment.has("error_description")))
    )
      router.push("/")

    const [accessToken, tokenType, error, errorDescription, urlName] = [
      fragment.get("access_token"),
      fragment.get("token_type"),
      fragment.get("error"),
      fragment.get("error_description"),
      fragment.get("state"),
    ]

    setUrlNameFromState(urlName)

    const target = `${window.location.origin}/${urlName}`

    const sendError = (e: string, d: string) => {
      if (!window.opener) {
        setDiscordError(processDiscordError({ error: e, errorDescription: d }))
      } else {
        window.opener.postMessage(
          {
            type: "DC_AUTH_ERROR",
            data: {
              error: e,
              errorDescription: d,
            },
          },
          target
        )
      }
    }

    // Error from authentication
    if (error) {
      sendError(error, errorDescription)
      return
    }

    fetchUserID(tokenType, accessToken)
      .then((discordId) => {
        // Later maybe add an endpoint that can just store an id. Fetch it here if opener is closed
        if (!window.opener) {
          setId(discordId)
        } else {
          window.opener.postMessage(
            {
              type: "DC_AUTH_SUCCESS",
              data: { id: discordId },
            },
            target
          )
        }
      })
      // Error from discord api fetching
      .catch(({ name, message }) => sendError(name, message))
  }, [router])

  if (
    canAccessOpener === undefined ||
    (!canAccessOpener && !id && !discordError.title)
  ) {
    return (
      <Center p="6" h="100vh">
        <Spinner size="lg" />
      </Center>
    )
  }

  if (id) {
    return (
      <Box p="6">
        <Heading size="md" mb="2">
          {updateResponse
            ? "Discord authentication successful!"
            : "You are almost there!"}
        </Heading>
        <Text>
          {updateResponse
            ? "You may now close this window, and return to Guild!"
            : "Just need to verify your address!"}
        </Text>
        {!updateResponse && (
          <Button
            mt={5}
            onClick={
              !account
                ? openWalletSelectorModal
                : !!createResponse || !!user.id
                ? () => onUpdateSubmit({ discordId: id })
                : () => onCreateSubmit({ address: account.toLowerCase() })
            }
            isLoading={isUpdateLoading || isCreateLoading || isUpdateSigning}
            loadingText={isUpdateLoading ? "Check your wallet" : "Loading"}
          >
            {!account
              ? "Connect your wallet"
              : createError || updateError
              ? "Try Again"
              : "Verify address"}
          </Button>
        )}
      </Box>
    )
  }

  return (
    <Box p="6">
      <Heading size="md" mb="2" color={discordError.title ? "red.400" : "inherit"}>
        {discordError.title ?? "You're being redirected"}
      </Heading>
      <Text color={discordError.description ? "red.400" : "inherit"}>
        {discordError.description ??
          "Closing the authentication window and taking you back to the site..."}
      </Text>
      {discordError.title && urlNameFromState?.length > 0 && (
        <Button
          mt={5}
          as="a"
          href={`https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&response_type=token&scope=identify&redirect_uri=${process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI}&state=${urlNameFromState}`}
        >
          Try again
        </Button>
      )}
    </Box>
  )
}
export default DCAuth
