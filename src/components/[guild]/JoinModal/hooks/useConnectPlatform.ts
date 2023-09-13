import { usePrevious } from "@chakra-ui/react"
import useUser from "components/[guild]/hooks/useUser"
import { usePostHogContext } from "components/_app/PostHogProvider"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import { useEffect } from "react"
import { PlatformName, User } from "types"
import fetcher from "utils/fetcher"
import useOauthPopupWindow, { AuthLevel } from "./useOauthPopupWindow"

const parseConnectError = (
  error: string
):
  | string
  | {
      params: Record<string, string>
      errors: { msg: string }[]
    } => {
  const regex = /^"(\d+)".*params: ({.*}), error: (\[.*\])/

  try {
    const [, rawNumber, rawParams, rawErrors] = error.match(regex)
    const number: number = parseInt(rawNumber)
    const params: Record<string, string> = JSON.parse(rawParams)
    const errors: { msg: string }[] = JSON.parse(rawErrors)

    if (
      typeof number !== "number" ||
      isNaN(number) ||
      !params ||
      !Array.isArray(errors)
    )
      return error

    return { params: { ...params, code: undefined }, errors }
  } catch {
    return error
  }
}

const useConnectPlatform = (
  platform: PlatformName,
  onSuccess?: () => void,
  isReauth?: boolean, // Temporary, once /connect works without it, we can remove this
  authLevel: AuthLevel = "membership",
  disconnectFromExistingUser?: boolean
) => {
  const { platformUsers } = useUser()

  const { onOpen, authData, isAuthenticating, ...rest } = useOauthPopupWindow(
    platform,
    isReauth ? "creation" : authLevel
  )

  const prevAuthData = usePrevious(authData)

  const { onSubmit, isLoading, response } = useConnect(() => {
    onSuccess?.()
  })

  useEffect(() => {
    // couldn't prevent spamming requests without all these three conditions
    if (!platformUsers || !authData || prevAuthData) return

    onSubmit({
      platformName: platform,
      authData,
      reauth: isReauth || undefined,
      disconnectFromExistingUser,
    })
  }, [authData, platformUsers])

  return {
    onConnect: onOpen,
    isLoading: isAuthenticating || isLoading,
    loadingText: isAuthenticating && "Confirm in the pop-up",
    response,
    authData,
    ...rest,
  }
}

const useConnect = (onSuccess?: () => void, isAutoConnect = false) => {
  const { captureEvent } = usePostHogContext()
  const showErrorToast = useShowErrorToast()
  const { showPlatformMergeAlert } = useWeb3ConnectionManager()

  const { mutate: mutateUser, id } = useUser()

  const submit = (signedValidation: SignedValdation) => {
    const platformName =
      JSON.parse(signedValidation?.signedPayload ?? "{}")?.platformName ??
      "UNKNOWN_PLATFORM"

    return fetcher(`/v2/users/${id}/platform-users`, {
      method: "POST",
      ...signedValidation,
    })
      .then((body) => {
        if (body === "rejected") {
          // eslint-disable-next-line @typescript-eslint/no-throw-literal
          throw [platformName, "Something went wrong, connect request rejected."]
        }

        if (typeof body === "string") {
          // eslint-disable-next-line @typescript-eslint/no-throw-literal
          throw [platformName, body]
        }

        return { ...body, platformName }
      })
      .catch((err) => {
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw [platformName, err]
      })
  }

  const { onSubmit, ...rest } = useSubmitWithSign<User["platformUsers"][number]>(
    submit,
    {
      onSuccess: (newPlatformUser) => {
        // captureEvent("Platform connection", { platformName })
        mutateUser(
          (prev) => ({
            ...prev,
            platformUsers: [...(prev?.platformUsers ?? []), newPlatformUser],
          }),
          { revalidate: false }
        )

        onSuccess?.()
      },
      onError: ([platformName, rawError]) => {
        const errorObject = {
          error: undefined,
          isAutoConnect: undefined,
          platformName,
        }
        let toastError

        if (isAutoConnect) {
          errorObject.isAutoConnect = true
        }

        if (typeof rawError === "string") {
          const parsedError = parseConnectError(rawError)
          errorObject.error = parsedError
          toastError =
            typeof parsedError === "string" ? parsedError : parsedError.errors[0].msg
        } else {
          errorObject.error = rawError
        }

        captureEvent("Platform connection error", errorObject)

        if (toastError?.startsWith("Before connecting your")) {
          const [, addressOrDomain] = toastError.match(
            /^Before connecting your (?:.*?) account, please disconnect it from this address: (.*?)$/
          )
          showPlatformMergeAlert(addressOrDomain, platformName)
        } else {
          showErrorToast(toastError ?? rawError)
        }
      },
    }
  )

  return {
    ...rest,
    onSubmit: (data) =>
      onSubmit({
        ...data,
        identityType: data?.platformName === "EMAIL" ? "EMAIL" : "PLATFORM",
      }),
  }
}

export default useConnectPlatform
export { useConnect }
