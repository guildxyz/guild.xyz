import useSWRWithOptionalAuth from "hooks/useSWRWithOptionalAuth"
import { Form } from "../CreateFormModal/schemas"
import useGuild from "./useGuild"

const useForms = () => {
  const { id } = useGuild()
  return useSWRWithOptionalAuth<Form[]>(`/v2/guilds/${id}/forms`)
}

export default useForms
