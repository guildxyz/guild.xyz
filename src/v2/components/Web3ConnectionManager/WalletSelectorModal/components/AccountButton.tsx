import { GuildAvatar } from "@/components/GuildAvatar"
import { Button } from "@/components/ui/Button"
import shortenHex from "utils/shortenHex"
import { useWeb3ConnectionManager } from "../../hooks/useWeb3ConnectionManager"

const AccountButton = () => {
  const { address } = useWeb3ConnectionManager()

  if (!address) return null

  return (
    <Button className="mb-4 w-full justify-between" disabled size="xl">
      {shortenHex(address)}
      <GuildAvatar address={address} />
    </Button>
  )
}

export default AccountButton
