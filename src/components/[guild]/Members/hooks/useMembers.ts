import useGuild from "components/[guild]/hooks/useGuild"
import useSWR from "swr"

const useMembers = () => {
  const { id } = useGuild()

  const { data } = useSWR<string[]>(`/role/members/${id}`)

  return data
}

export default useMembers
