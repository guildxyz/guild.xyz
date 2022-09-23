import { Chain } from "connectors"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { UseFieldArrayAppend } from "react-hook-form"
import useLocks from "../components/UnlockFormCard/hooks/useLocks"
import { unlockSupportedChains } from "../components/UnlockFormCard/UnlockFormCard"

const useAddRequirementsFromQuery = (
  append: UseFieldArrayAppend<any, "requirements">
) => {
  const router = useRouter()

  const { locks } = useLocks(
    ((router.query.chain as string)?.toUpperCase() ?? "ETHEREUM") as Chain
  )

  useEffect(() => {
    if (!router.isReady || !locks) return
    const chain = (router.query.chain as string)?.toUpperCase()
    const address = (router.query.unlockAddress as string)?.toLowerCase()
    if (
      address?.length > 0 &&
      chain?.length > 0 &&
      locks.some((lock) => lock.address === address) &&
      unlockSupportedChains.includes(chain)
    ) {
      append({
        type: "UNLOCK",
        chain: chain as Chain,
        address,
        data: {},
      })
    }
  }, [router, locks])
}

export default useAddRequirementsFromQuery
