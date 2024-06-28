import { GuildAvatar } from "@/components/GuildAvatar"
import { Button } from "@/components/ui/Button"
import useWeb3ConnectionManager from "components/_app/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import shortenHex from "utils/shortenHex"

const AccountButton = () => {
  const { address } = useWeb3ConnectionManager()

  if (!address) return null

  return (
    <Button variant="accent" className="mb-4 justify-between" disabled size="xl">
      {shortenHex(address)}
      <GuildAvatar address={address} />
    </Button>
  )
}
export default AccountButton
