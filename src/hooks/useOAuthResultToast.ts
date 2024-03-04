import { useRouter } from "next/router"
import platforms from "platforms/platforms"
import { useEffect } from "react"
import { PlatformName } from "types"
import useToast from "./useToast"

export default function useOAuthResultToast() {
  const toast = useToast()
  const router = useRouter()

  useEffect(() => {
    if (router.query["oauth-status"] && router.query["oauth-platform"]) {
      router.replace(router.basePath)
      toast({
        status: "success",
        description: `${
          platforms[router.query["oauth-platform"] as PlatformName].name
        } successfully connected`,
      })
    }
  }, [router.query])
}
