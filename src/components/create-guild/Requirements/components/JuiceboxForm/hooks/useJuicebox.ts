import useSWRImmutable from "swr/immutable"
import { JuiceboxProject } from "types"

export const useJuicebox = () => {
  const { data, isValidating } =
    useSWRImmutable<Array<JuiceboxProject>>("/assets/juicebox")

  return { projects: data, isLoading: isValidating }
}

export const useJuiceboxProject = (id: string) => {
  const { data, isValidating } = useSWRImmutable<JuiceboxProject>(
    id ? `/assets/juicebox/${id}` : null
  )

  return { project: data, isLoading: isValidating }
}
