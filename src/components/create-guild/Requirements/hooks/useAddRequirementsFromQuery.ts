import { useRouter } from "next/router"
import { useEffect } from "react"
import { UseFieldArrayAppend } from "react-hook-form"
import { GuildFormType, SupportedChains } from "types"
import { unlockSupportedChains } from "../components/UnlockFormCard/UnlockFormCard"

const useAddRequirementsFromQuery = (
  append: UseFieldArrayAppend<GuildFormType, "requirements">
) => {
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) return
    const chain = (router.query.chain as string)?.toUpperCase()
    const unlockId = (router.query.unlockId as string)?.toLowerCase()
    if (
      unlockId?.length > 0 &&
      chain?.length > 0 &&
      unlockSupportedChains.includes(chain)
    ) {
      append({
        type: "UNLOCK",
        chain: chain as SupportedChains,
        address: unlockId,
      })
    }
  }, [router])
}

export default useAddRequirementsFromQuery
