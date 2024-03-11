import { platformMergeAlertAtom } from "components/_app/Web3ConnectionManager/components/PlatformMergeErrorAlert"
import { useSetAtom } from "jotai"
import { useRouter } from "next/router"
import platforms from "platforms/platforms"
import { useEffect } from "react"
import { PlatformName } from "types"
import useToast from "./useToast"

export default function useOAuthResultToast() {
  const toast = useToast()
  const router = useRouter()
  const showPlatformMergeAlert = useSetAtom(platformMergeAlertAtom)

  useEffect(() => {
    if (router.query["oauth-status"]) {
      const platformNameHumanReadable =
        platforms[(router.query["oauth-platform"] as PlatformName) ?? ""]?.name ??
        "Social"

      const title =
        router.query["oauth-status"] === "success"
          ? `${platformNameHumanReadable} successfully connected`
          : `Failed to connect ${platformNameHumanReadable}`

      if (
        router.query["oauth-status"] === "error" &&
        router.query["oauth-message"]
          ?.toString()
          ?.startsWith("Before connecting your")
      ) {
        const [, addressOrDomain] = router.query["oauth-message"]
          ?.toString()
          .match(
            /^Before connecting your (?:.*?) account, please disconnect it from this address: (.*?)$/
          )

        showPlatformMergeAlert({
          addressOrDomain,
          platformName: router.query["oauth-platform"] as PlatformName,
        })
      } else {
        toast({
          status: router.query["oauth-status"] as "success" | "error",
          title,
          description: router.query["oauth-message"],
        })
      }

      router.replace(router.basePath)
    }
  }, [router.query])
}
