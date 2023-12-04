import Button from "components/common/Button"
import useSetKeyPair from "hooks/useSetKeyPair"
import Image from "next/image"

const LinkDelegateVaultButton = ({ vaults }) => {
  const set = useSetKeyPair()

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
        set.onSubmit({ provider: "DELEGATE" })
      }}
      isLoading={set.isLoading}
      loadingText="Check your wallet"
    >
      Link {vaults.length > 1 ? vaults.length : ""} unlinked vault
      {vaults.length > 1 ? "s" : ""}
    </Button>
  )
}

export default LinkDelegateVaultButton
