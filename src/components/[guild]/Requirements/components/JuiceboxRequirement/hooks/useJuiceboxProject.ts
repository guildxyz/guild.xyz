import useSWRImmutable from "swr/immutable"
import { JuiceboxProject } from "types"

const useJuiceboxProject = (id: string) => {
  const { data, isValidating } = useSWRImmutable<JuiceboxProject>(
    id ? `/assets/juicebox/${id}` : null
  )

  return { project: data, isLoading: isValidating }
}

export default useJuiceboxProject
