import { useRouter } from "next/router"
import useSWRImmutable from "swr/immutable"
import { Role } from "temporaryData/types"

const useRole = (roleId?): Role => {
  const router = useRouter()

  const { data } = useSWRImmutable(`/role/urlName/${roleId ?? router.query.role}`)

  return data
}

export default useRole
