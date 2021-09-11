import { Box, Heading, Text } from "@chakra-ui/react"
import { useRouter } from "next/dist/client/router"
import { useEffect } from "react"

const newNamedError = (name: string, message: string) => {
  const error = new Error(message)
  error.name = name
  return error
}

const fetchUserID = async (
  tokenType: string,
  accessToken: string
): Promise<string> => {
  const response = await fetch("https://discord.com/api/users/@me", {
    headers: {
      authorization: `${tokenType} ${accessToken}`,
    },
  }).catch(() => {
    throw newNamedError("Network error", "Unable to connect to Discord server")
  })

  if (!response.ok)
    throw newNamedError(
      "Discord error",
      "There was an error, while fetching the user data"
    )

  const { id } = await response.json()

  const hashResponse = await fetch("/api/hash", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: id }),
  })

  if (!hashResponse.ok)
    throw newNamedError("Hashing error", "Failed to hash Discord user ID")

  const { hashed }: { hashed: string } = await hashResponse.json()

  return hashed
}

const DCAuth = () => {
  const router = useRouter()

  useEffect(() => {
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

    const target = `${window.location.origin}/${urlName}`

    const sendError = (e: string, d: string) =>
      window.opener &&
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

    // Error from authentication
    if (error) sendError(error, errorDescription)

    fetchUserID(tokenType, accessToken)
      .then(
        (id) =>
          // Later maybe add an endpoint that can just store an id. Fetch it here if opener is closed
          window.opener &&
          window.opener.postMessage(
            {
              type: "DC_AUTH_SUCCESS",
              data: { id },
            },
            target
          )
      )
      // Error from discord api fetching
      .catch(({ name, message }) => sendError(name, message))
  }, [router])

  return (
    <Box p="6">
      <Heading size="md" mb="2">
        You're being redirected
      </Heading>
      <Text>
        Closing the authentication window and taking you back to the site...
      </Text>
    </Box>
  )
}
export default DCAuth
