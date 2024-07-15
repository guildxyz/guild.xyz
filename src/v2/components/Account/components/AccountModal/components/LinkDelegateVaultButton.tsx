import { Button } from "@/components/ui/Button"
import Image from "next/image"
import useDelegateVaults from "../hooks/useDelegateVaults"
import useLinkVaults from "../hooks/useLinkVaults"

const LinkDelegateVaultButton = ({
  vaults,
}: {
  vaults: ReturnType<typeof useDelegateVaults>
}) => {
  const linkDelegations = useLinkVaults()

  return (
    <Button
      size="sm"
      onClick={() => {
        linkDelegations.onSubmit()
      }}
      isLoading={linkDelegations.isLoading}
      loadingText="Check your wallet"
    >
      <Image
        width={15}
        height={15}
        alt="Delegate.cash logo"
        src="/walletLogos/delegatecash.png"
      />
      Link {vaults.length > 1 ? vaults.length : ""} vault
      {vaults.length > 1 ? "s" : ""}
    </Button>
  )
}

export default LinkDelegateVaultButton
