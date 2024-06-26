import useGuild from "components/[guild]/hooks/useGuild"
import { RoleToCreate } from "components/create-guild/hooks/useCreateRole"
import { useForm } from "react-hook-form"
import { RoleFormType, Visibility } from "types"
import getRandomInt from "utils/getRandomInt"

const useAddRoleForm = () => {
  const { id } = useGuild()

  const defaultValues: RoleToCreate = {
    guildId: id,
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
    visibility: Visibility.PUBLIC,
    rolePlatforms: [],
  }

  const methods = useForm<RoleFormType>({
    mode: "all",
    defaultValues,
  })

  return { ...methods, defaultValues }
}

export default useAddRoleForm
