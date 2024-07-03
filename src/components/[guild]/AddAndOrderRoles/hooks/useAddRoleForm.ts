import useGuild from "components/[guild]/hooks/useGuild"
import { RoleToCreate } from "components/create-guild/hooks/useCreateRole"
import { useForm } from "react-hook-form"
import { RoleFormType } from "types"
import getRandomInt from "utils/getRandomInt"

const useAddRoleForm = () => {
  const { id } = useGuild()

  const defaultValues: RoleToCreate = {
    guildId: id as number, // Safe to cast here, since we'll have guildId by the time we call this hook
    name: "",
    description: "",
    logic: "AND",
    requirements: [
      {
        type: "FREE",
      },
    ],
    roleType: "NEW",
    imageUrl: `/guildLogos/${getRandomInt(286)}.svg`,
    visibility: "PUBLIC",
    rolePlatforms: [],
  }

  const methods = useForm<RoleFormType>({
    mode: "all",
    defaultValues,
  })

  return { ...methods, defaultValues }
}

export default useAddRoleForm
