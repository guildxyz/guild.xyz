import useKeyPair from "components/_app/useKeyPairContext"
import Button from "components/common/Button"
import Image from "next/image"

const LinkDelegateVaultButton = ({ vaults }) => {
  const { set } = useKeyPair()

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
        set.onSubmit(false, "DELEGATE")
      }}
      isLoading={set.isLoading || set.isSigning}
      loadingText="Check your wallet"
    >
      Link {vaults.length > 1 ? vaults.length : ""} unlinked vault
      {vaults.length > 1 ? "s" : ""}
    </Button>
  )
}

export default LinkDelegateVaultButton
