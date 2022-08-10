import { useWeb3React } from "@web3-react/core"
import useGuild from "components/[guild]/hooks/useGuild"
import useSWRImmutable from "swr/immutable"
import useUser from "./useUser"

const useGuildPermission = () => {
  const { account } = useWeb3React()
  const { id } = useUser()
  const guild = useGuild()

  const { data: isSuperAdmin } = useSWRImmutable(
    account ? `/guild/isSuperAdmin/${account}` : null
  )

  if (!Array.isArray(guild.admins) || typeof id !== "number")
    return { isAdmin: false, isOwner: false }

  const admin = guild.admins.find((a) => a?.id === id)

  return {
    isAdmin: !!admin || isSuperAdmin,
    isOwner: !!admin?.isOwner,
  }
}

export default useGuildPermission
