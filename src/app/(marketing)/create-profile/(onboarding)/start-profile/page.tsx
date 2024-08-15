"use client"
import { useRouter } from "next/navigation"
import { StartProfile } from "../_components/StartProfile"
// import { chainDataAtom } from "../atoms"

const Page = () => {
  // const [chainData] = useAtom(chainDataAtom)
  const router = useRouter()

  return (
    <StartProfile
      chainData={{}}
      dispatchChainAction={({ action, data }) => {
        if (action === "next") {
          // router.push("")
        }
        if (action === "previous") {
          router.back()
        }
      }}
    />
  )
}

export default Page
