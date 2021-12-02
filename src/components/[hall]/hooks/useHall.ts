import { useRouter } from "next/router"
import useSWRImmutable from "swr/immutable"
import { Hall } from "temporaryData/types"

const useHall = (): Hall => {
  const router = useRouter()

  const { data } = useSWRImmutable(`/guild/urlName/${router.query.hall}`)

  return data
}

export default useHall
