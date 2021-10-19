import { useGuild } from "components/[guild]/Context"
import useSWR from "swr"

const fetchMembers = async (_, id) =>
  fetch(`${process.env.NEXT_PUBLIC_API}/guild/members/${id}`).then((data) =>
    data.json()
  )

const useMembers = () => {
  const { id } = useGuild()

  const { data } = useSWR(["members", id], fetchMembers)

  return data
}

export default useMembers
