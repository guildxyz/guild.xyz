import { Center, Heading, Text } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { useEffect } from "react"

const GoogleAuth = () => {
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady || !window.opener) return

    const target = window.location.origin

    if (router.query.code?.toString())
      window.opener.postMessage({
        type: "GOOGLE_AUTH_SUCCESS",
        data: {
          code: router.query.code?.toString(),
          state: router.query.state?.toString(),
        },
        target,
      })
  }, [router])

  if (typeof window === "undefined") return null

  return (
    <Center flexDir="column" p="10" textAlign="center" h="90vh">
      <Heading size="md" mb="3">
        {!!window?.opener ? "You're being redirected" : "Unsupported browser"}
      </Heading>
      <Text>
        {!!window?.opener
          ? "Closing the authentication window and taking you back to the site..."
          : "This browser doesn't seem to support our authentication method, please try again in your regular browser app with WalletConnect, or from desktop!"}
      </Text>
    </Center>
  )
}

export default GoogleAuth
