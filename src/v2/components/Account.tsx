"use client"

import { SignIn } from "@phosphor-icons/react/dist/ssr"
import { walletSelectorModalAtom } from "components/_app/Web3ConnectionManager/components/WalletSelectorModal"
import useWeb3ConnectionManager from "components/_app/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import { useSetAtom } from "jotai"
import { Button, ButtonProps } from "./ui/Button"

export const Account = () => {
  const { isWeb3Connected, disconnect } = useWeb3ConnectionManager()

  const setIsWalletSelectorModalOpen = useSetAtom(walletSelectorModalAtom)

  if (!isWeb3Connected)
    return (
      <AccountButton onClick={() => setIsWalletSelectorModalOpen(true)}>
        <SignIn weight="bold" className="mr-1" />
        Sign in
      </AccountButton>
    )

  return <AccountButton onClick={() => disconnect()}>Disconnect</AccountButton>
}

const AccountButton = ({ children, ...buttonProps }: ButtonProps) => (
  <Button
    className="rounded-2xl bg-black/50 text-white/90 hover:bg-black/40 active:bg-black/30"
    {...buttonProps}
  >
    {children}
  </Button>
)
