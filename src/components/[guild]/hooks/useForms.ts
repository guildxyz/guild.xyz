import useSWRImmutable from "swr/immutable"
import { Form } from "../CreateFormModal/schemas"
import useGuild from "./useGuild"

const useForms = () => {
  const { id } = useGuild()
  return useSWRImmutable<Form[]>(`/v2/guilds/${id}/forms`)
}

export default useForms
