import { usePrevious } from "@chakra-ui/react"
import useUser from "components/[guild]/hooks/useUser"
import { usePostHogContext } from "components/_app/PostHogProvider"
import { platformMergeAlertAtom } from "components/_app/Web3ConnectionManager/components/PlatformMergeErrorAlert"
import { StopExecution } from "components/_app/Web3ConnectionManager/components/WalletSelectorModal/components/GoogleLoginButton/hooks/useLoginWithGoogle"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit, { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import { UseSubmitOptions } from "hooks/useSubmit/useSubmit"
import { useSetAtom } from "jotai"
import { useEffect } from "react"
import { PlatformName } from "types"
import fetcher, { useFetcherWithSign } from "utils/fetcher"
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

  const { onSubmit, isLoading, response } = useConnect({
    onSuccess: () => {
      onSuccess?.()
    },
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

const useConnect = (useSubmitOptions?: UseSubmitOptions, isAutoConnect = false) => {
  const { captureEvent } = usePostHogContext()
  const showErrorToast = useShowErrorToast()
  const showPlatformMergeAlert = useSetAtom(platformMergeAlertAtom)

  const { mutate: mutateUser, id } = useUser()

  const fetcherWithSign = useFetcherWithSign()

  const submit = ({ signOptions = undefined, ...payload }) => {
    const platformName = payload?.platformName ?? "UNKNOWN_PLATFORM"

    const userId =
      id ??
      signOptions?.address?.toLowerCase() ??
      signOptions?.walletClient?.account?.address?.toLowerCase()

    return fetcherWithSign([
      `/v2/users/${userId}/platform-users`,
      {
        signOptions,
        method: "POST",
        body: payload,
      },
    ])
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

  return useSubmit(submit, {
    onSuccess: (newPlatformUser) => {
      mutateUser(
        (prev) => ({
          ...prev,
          platformUsers: [
            ...(prev?.platformUsers ?? []).filter(
              ({ platformId }) => platformId !== newPlatformUser.platformId
            ),
            newPlatformUser,
          ],
        }),
        { revalidate: false }
      )

      useSubmitOptions?.onSuccess?.()
    },
    onError: ([platformName, rawError]) => {
      try {
        useSubmitOptions?.onError?.([platformName, rawError])
      } catch (err) {
        if (err instanceof StopExecution) {
          return
        }
      }

      const errorObject = {
        error: undefined,
        isAutoConnect: undefined,
        platformName,
      }
      let toastError: string

      if (isAutoConnect) {
        errorObject.isAutoConnect = true
      }

      if (typeof rawError?.error === "string") {
        const parsedError = parseConnectError(rawError.error)
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
        showPlatformMergeAlert({ addressOrDomain, platformName })
      } else {
        showErrorToast(
          toastError
            ? { error: toastError, correlationId: rawError.correlationId }
            : // temporary until we solve the X rate limit
            platformName === "TWITTER"
            ? {
                error:
                  "There're a lot of users connecting now, and X is rate limiting us, so your request timed out. Please try again later!",
              }
            : rawError
        )
      }
    },
  })
}

type EmailConnectRepsonse = {
  createdAt: Date
  domain: string
  address: string
  emailVerificationCodeId: number
  id: number
  identityId: number
  primary: boolean
}

const useConnectEmail = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void
  onError?: (error: any) => void
} = {}) => {
  const { captureEvent } = usePostHogContext()
  const { mutate: mutateUser, id } = useUser()

  const submit = (signedValidation: SignedValidation) => {
    const { emailAddress } = JSON.parse(signedValidation?.signedPayload ?? "{}")

    return fetcher(`/v2/users/${id}/emails/${emailAddress}/verification`, {
      method: "POST",
      ...signedValidation,
    })
  }

  const { onSubmit, ...rest } = useSubmitWithSign<EmailConnectRepsonse>(submit, {
    onSuccess: (newPlatformUser = {} as any) => {
      mutateUser(
        (prev) => ({
          ...prev,
          emails: {
            emailAddress: newPlatformUser?.address,
            createdAt: newPlatformUser?.createdAt,
            pending: false,
          },
        }),
        { revalidate: false }
      )

      onSuccess?.()
    },
    onError: (error) => {
      captureEvent("Email connection error", error)
      onError?.(error)
    },
  })

  return {
    ...rest,
    onSubmit: (params: { authData: { code: string }; emailAddress: string }) =>
      onSubmit({
        ...params,
        identityType: "EMAIL",
      }),
  }
}

export default useConnectPlatform
export { useConnect, useConnectEmail }
