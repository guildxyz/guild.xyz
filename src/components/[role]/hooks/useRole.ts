import { useRouter } from "next/router"
import useSWRImmutable from "swr/immutable"
import { Role } from "temporaryData/types"

const useRole = (roleId?): Role => {
  const router = useRouter()

  const { data } = useSWRImmutable(
    roleId || router.query.role
      ? `/role/urlName/${roleId ?? router.query.role}`
      : null
  )

  return data
}

export default useRole
