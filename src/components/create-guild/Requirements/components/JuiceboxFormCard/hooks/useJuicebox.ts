import useSWRImmutable from "swr/immutable"

type Data = {
  id: string
  uri: string
  name: string
  logoUri: string
}

const useJuicebox = () => {
  const { data, isValidating } = useSWRImmutable<Data[]>("/api/juicebox")

  return { projects: data, isLoading: isValidating }
}

export default useJuicebox
