import { Schemas } from "@guildxyz/types"
import useSWRWithOptionalAuth from "hooks/useSWRWithOptionalAuth"
import useGuild from "./useGuild"

const useGuildForms = () => {
  const { id } = useGuild()
  return useSWRWithOptionalAuth<Schemas["Form"][]>(
    id ? `/v2/guilds/${id}/forms` : null,
    undefined,
    false,
    false
  )
}

const useGuildForm = (formId?: number) => {
  const { data, ...rest } = useGuildForms()
  return {
    // @ts-expect-error TODO: fix this error originating from strictNullChecks
    form: data?.find((form) => form.id === formId),
    ...rest,
  }
}

export default useGuildForms
export { useGuildForm }
