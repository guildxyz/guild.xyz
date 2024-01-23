import useSWRImmutable from "swr/immutable"
import useGuild from "./useGuild"

const useForms = () => {
  const { id } = useGuild()
  return useSWRImmutable(`/v2/guilds/${id}/forms`)
}

export default useForms
