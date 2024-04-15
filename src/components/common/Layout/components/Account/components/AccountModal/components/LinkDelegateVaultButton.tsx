import Button from "components/common/Button"
import Image from "next/image"
import useLinkVaults from "../hooks/useLinkVaults"

const LinkDelegateVaultButton = ({ vaults }) => {
  const linkDelegations = useLinkVaults()

  return (
    <Button
      leftIcon={
        <Image
          width={15}
          height={15}
          alt={"Delegate.cash logo"}
          src={`/walletLogos/delegatecash.png`}
        />
      }
      size="sm"
      onClick={() => {
        linkDelegations.onSubmit()
      }}
      isLoading={linkDelegations.isLoading}
      loadingText="Check your wallet"
    >
      Link {vaults.length > 1 ? vaults.length : ""} vault
      {vaults.length > 1 ? "s" : ""}
    </Button>
  )
}

export default LinkDelegateVaultButton
