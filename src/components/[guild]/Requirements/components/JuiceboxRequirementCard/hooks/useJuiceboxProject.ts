import useSWRImmutable from "swr/immutable"

type Data = {
  id: string
  uri: string
  name: string
  logoUri: string
}

const useJuiceboxProject = (id: string) => {
  const { data, isValidating } = useSWRImmutable<Data>(
    id ? `/api/juicebox/${id}` : null
  )

  return { project: data, isLoading: isValidating }
}

export default useJuiceboxProject
