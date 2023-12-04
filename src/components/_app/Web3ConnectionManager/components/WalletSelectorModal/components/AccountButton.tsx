import useWeb3ConnectionManager from "components/_app/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import Button from "components/common/Button"
import GuildAvatar from "components/common/GuildAvatar"
import shortenHex from "utils/shortenHex"

const AccountButton = () => {
  const { address } = useWeb3ConnectionManager()

  if (!address) return null

  return (
    <Button
      mb="4"
      rightIcon={<GuildAvatar address={address} size={5} />}
      isDisabled
      w="full"
      size="xl"
      justifyContent="space-between"
    >
      {shortenHex(address)}
    </Button>
  )
}
export default AccountButton
