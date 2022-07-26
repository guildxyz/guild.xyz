import { Center, Heading, Text } from "@chakra-ui/react"
import useLocalStorage from "hooks/useLocalStorage"
import { useRouter } from "next/dist/client/router"
import { useEffect } from "react"

const OAuth = () => {
  const router = useRouter()
  const [csrfTokenFromLocalStorage, setCsrfToken] = useLocalStorage(
    "oauth_csrf_token",
    ""
  )

  useEffect(() => {
    if (
      !router.isReady ||
      !csrfTokenFromLocalStorage ||
      csrfTokenFromLocalStorage.length <= 0
    )
      return

    // We navigate to the index page if the dcauth page is used incorrectly
    // For example if someone just manually goes to /dcauth

    let code = null
    let error = null
    let errorDescription = null
    let state = null

    const areParamsInURLFragments = window.location.hash.length > 0

    if (areParamsInURLFragments) {
      if (!window.location.hash) router.push("/")
      const fragment = new URLSearchParams(window.location.hash.slice(1))

      if (
        !fragment.has("state") ||
        (!fragment.has("code") &&
          (!fragment.has("error") || !fragment.has("error_description")))
      )
        router.push("/")

      code = fragment.get("code")
      error = fragment.get("error")
      errorDescription = fragment.get("error_description")
      state = fragment.get("state")
    } else {
      code = router.query.code
      error = router.query.error
      errorDescription = router.query.error_description
      state = router.query.state
    }

    if (error) {
      window.localStorage.setItem(
        "oauth_popup_data",
        JSON.stringify({
          type: "OAUTH_ERROR",
          data: { error, errorDescription },
        })
      )
      return
    }

    if (state !== csrfTokenFromLocalStorage) {
      window.localStorage.setItem(
        "oauth_popup_data",
        JSON.stringify({
          type: "OAUTH_ERROR",
          data: {
            error: "CSRF Error",
            errorDescription:
              "CSRF token mismatches, this incicates possible csrf attack.",
          },
        })
      )
      return
    } else {
      setCsrfToken(undefined)
    }

    window.localStorage.setItem(
      "oauth_popup_data",
      JSON.stringify({
        type: "OAUTH_SUCCESS",
        data: code,
      })
    )
  }, [router, csrfTokenFromLocalStorage])

  if (typeof window === "undefined") return null

  return (
    <Center flexDir={"column"} p="10" textAlign={"center"} h="90vh">
      <Heading size="md" mb="3">
        You're being redirected
      </Heading>
      <Text>
        Closing the authentication window and taking you back to the site...
      </Text>
    </Center>
  )
}
export default OAuth
