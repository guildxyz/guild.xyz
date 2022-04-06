import { Center, Heading, Text } from "@chakra-ui/react"
import { useRouter } from "next/dist/client/router"
import { useEffect } from "react"

const DCAuth = () => {
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady || !window.opener) return

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

    const [accessToken, tokenType, error, errorDescription, url] = [
      fragment.get("access_token"),
      fragment.get("token_type"),
      fragment.get("error"),
      fragment.get("error_description"),
      fragment.get("state"),
    ]

    const target = `${window.location.origin}${url}`

    if (error) {
      window.opener.postMessage(
        {
          type: "DC_AUTH_ERROR",
          data: { error, errorDescription },
        },
        target
      )
    } else {
      window.opener.postMessage(
        {
          type: "DC_AUTH_SUCCESS",
          data: `${tokenType} ${accessToken}`,
        },
        target
      )
    }
  }, [router])

  if (typeof window === "undefined") return null

  return (
    <Center flexDir={"column"} p="10" textAlign={"center"} h="90vh">
      <Heading size="md" mb="3">
        {!!window?.opener ? "You're being redirected" : "Unsupported browser"}
      </Heading>
      <Text>
        {!!window?.opener
          ? "Closing the authentication window and taking you back to the site..."
          : "This browser doesn't seem to support our authentication method, please try again in a different one!"}
      </Text>
    </Center>
  )
}
export default DCAuth
