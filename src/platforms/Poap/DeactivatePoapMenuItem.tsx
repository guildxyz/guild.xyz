import { MenuItem, Spinner } from "@chakra-ui/react"
import useUpdateGuildPoap from "components/[guild]/CreatePoap/hooks/useUpdateGuildPoap"
import useToast from "hooks/useToast"
import { LockSimple } from "phosphor-react"
import { GuildPoap } from "types"

type Props = {
  guildPoap: GuildPoap
}

const DeactivatePoapMenuItem = ({ guildPoap }: Props): JSX.Element => {
  const toast = useToast()
  const { onSubmit, isLoading } = useUpdateGuildPoap(guildPoap, {
    onSuccess: () => {
      toast({ status: "success", title: "Successfully deactivated POAP" })
    },
  })

  return (
    <MenuItem
      isDisabled={isLoading}
      icon={isLoading ? <Spinner size="xs" /> : <LockSimple />}
      onClick={() => onSubmit({ id: guildPoap.id, activate: false })}
    >
      Deactivate POAP
    </MenuItem>
  )
}

export default DeactivatePoapMenuItem
