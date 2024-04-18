import { platformMergeAlertAtom } from "components/_app/Web3ConnectionManager/components/PlatformMergeErrorAlert"
import { useSetAtom } from "jotai"
import { useRouter } from "next/router"
import rewards from "platforms/rewards"
import { useEffect } from "react"
import { PlatformName } from "types"
import useToast from "./useToast"

export default function useOAuthResultToast() {
  const toast = useToast()
  const { query, basePath, replace } = useRouter()
  const showPlatformMergeAlert = useSetAtom(platformMergeAlertAtom)

  useEffect(() => {
    if (query["oauth-status"]) {
      const platformNameHumanReadable =
        rewards[(query["oauth-platform"] as PlatformName) ?? ""]?.name ?? "Social"

      const title =
        query["oauth-status"] === "success"
          ? `${platformNameHumanReadable} successfully connected`
          : `Failed to connect ${platformNameHumanReadable}`

      if (
        query["oauth-status"] === "error" &&
        query["oauth-message"]?.toString()?.startsWith("Before connecting your")
      ) {
        const [, addressOrDomain] = query["oauth-message"]
          ?.toString()
          .match(
            /^Before connecting your (?:.*?) account, please disconnect it from this address: (.*?)$/
          )

        showPlatformMergeAlert({
          addressOrDomain,
          platformName: query["oauth-platform"] as PlatformName,
        })
      } else {
        toast({
          status: query["oauth-status"] as "success" | "error",
          title,
          description: query["oauth-message"],
        })
      }

      replace(basePath)
    }
    /** Toast is intentionally left out, as it causes the toast to fire twice */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, showPlatformMergeAlert, replace, basePath])
}
