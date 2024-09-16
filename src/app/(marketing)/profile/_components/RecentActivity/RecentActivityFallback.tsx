import { walletSelectorModalAtom } from "@/components/Providers/atoms"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { SignIn } from "@phosphor-icons/react"
import { useSetAtom } from "jotai"
import { useProfile } from "../../_hooks/useProfile"

const RecentActivityFallback = () => {
  const { data: profile } = useProfile()
  const setIsWalletSelectorModalOpen = useSetAtom(walletSelectorModalAtom)

  return (
    <Card className="flex items-center px-5 py-4">
      <p className="w-full font-medium">
        {`Sign in to view `}
        <span className="font-bold">
          {profile?.name ?? profile?.username ?? "the profile"}
        </span>
        's activity
      </p>
      <Button
        onClick={() => setIsWalletSelectorModalOpen(true)}
        colorScheme="primary"
      >
        <SignIn weight="bold" size={24} />
        <span>Sign in</span>
      </Button>
    </Card>
  )
}

export default RecentActivityFallback
