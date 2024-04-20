import { platformMergeAlertAtom } from "components/_app/Web3ConnectionManager/components/PlatformMergeErrorAlert"
import { useSetAtom } from "jotai"
import { useRouter } from "next/router"
import rewards from "platforms/rewards"
import { useEffect } from "react"
import { PlatformName } from "types"
import useToast from "./useToast"

export default function useOAuthResultToast() {
  const toast = useToast()
  const { query, replace, pathname } = useRouter()
  const showPlatformMergeAlert = useSetAtom(platformMergeAlertAtom)

  useEffect(() => {
    if (query["oauth-status"]) {
      const {
        ["oauth-platform"]: oauthPlatform,
        ["oauth-status"]: oauthStatus,
        ["oauth-message"]: oauthMessage,
        ...newQuery
      } = query

      const platformNameHumanReadable =
        rewards[(oauthPlatform as PlatformName) ?? ""]?.name ?? "Social"

      const title =
        oauthStatus === "success"
          ? `${platformNameHumanReadable} successfully connected`
          : `Failed to connect ${platformNameHumanReadable}`

      if (
        oauthStatus === "error" &&
        oauthMessage?.toString()?.startsWith("Before connecting your")
      ) {
        const [, addressOrDomain] = oauthMessage
          ?.toString()
          .match(
            /^Before connecting your (?:.*?) account, please disconnect it from this address: (.*?)$/
          )

        showPlatformMergeAlert({
          addressOrDomain,
          platformName: oauthPlatform as PlatformName,
        })
      } else {
        toast({
          status: oauthStatus as "success" | "error",
          title,
          description: oauthMessage,
        })
      }

      replace({ pathname, query: newQuery })
    }
    /** Toast is intentionally left out, as it causes the toast to fire twice */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, showPlatformMergeAlert, replace, pathname])
}
