import useSWRImmutable from "swr/immutable"

type JuiceboxProject = {
  id: string
  uri: string
  name: string
  logoUri: string
}

export const useJuicebox = (search = "") => {
  const { data, isLoading } = useSWRImmutable<Array<JuiceboxProject>>(
    search.length > 0 ? `/assets/juicebox/project?search=${search}` : null
  )

  return { projects: data, isLoading }
}

export const useJuiceboxProject = (id: string) => {
  const { data, isLoading, error } = useSWRImmutable<JuiceboxProject>(
    id ? `/assets/juicebox/project/${id}` : null
  )

  return { project: data, isLoading, error }
}
