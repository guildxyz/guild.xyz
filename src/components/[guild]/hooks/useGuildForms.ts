import { Schemas } from "@guildxyz/types"
import useSWRWithOptionalAuth from "hooks/useSWRWithOptionalAuth"
import useGuild from "./useGuild"

const useGuildForms = () => {
  const { id } = useGuild()
  return useSWRWithOptionalAuth<Schemas["Form"][]>(
    id ? `/v2/guilds/${id}/forms` : null
  )
}

const useGuildForm = (formId?: number) => {
  const { data, ...rest } = useGuildForms()

  return {
    form: data?.find((form) => form.id === formId),
    ...rest,
  }
}

export default useGuildForms
export { useGuildForm }
