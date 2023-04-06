import useSWRImmutable from "swr/immutable"

type JuiceboxProject = {
  id: string
  uri: string
  name: string
  logoUri: string
}

export const useJuicebox = () => {
  const { data, isValidating } = useSWRImmutable<Array<JuiceboxProject>>(
    "/assets/juicebox/project"
  )

  return { projects: data, isLoading: isValidating }
}

export const useJuiceboxProject = (id: string) => {
  const { data, isValidating, error } = useSWRImmutable<JuiceboxProject>(
    id ? `/assets/juicebox/project/${id}` : null
  )

  return { project: data, isLoading: isValidating, error }
}
