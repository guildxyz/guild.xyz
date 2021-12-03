import useRole from "components/[role]/hooks/useRole"
import useSWR from "swr"

const useMembers = () => {
  const { id } = useRole()

  const { data } = useSWR<string[]>(`/role/members/${id}`)

  return data
}

export default useMembers
