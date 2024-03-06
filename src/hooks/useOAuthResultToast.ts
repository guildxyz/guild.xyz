import { useRouter } from "next/router"
import platforms from "platforms/platforms"
import { useEffect } from "react"
import { PlatformName } from "types"
import useToast from "./useToast"

export default function useOAuthResultToast() {
  const toast = useToast()
  const router = useRouter()

  useEffect(() => {
    if (router.query["oauth-status"]) {
      const platformNameHumanReadable =
        platforms[(router.query["oauth-platform"] as PlatformName) ?? ""]?.name ??
        "Social"

      const title =
        router.query["oauth-status"] === "success"
          ? `${platformNameHumanReadable} successfully connected`
          : `Failed to connect ${platformNameHumanReadable}`

      toast({
        status: router.query["oauth-status"] as "success" | "error",
        title,
        description: router.query["oauth-message"],
      })

      router.replace(router.basePath)
    }
  }, [router.query])
}
