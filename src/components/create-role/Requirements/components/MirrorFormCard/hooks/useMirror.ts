import useSWRImmutable from "swr/immutable"

const useMirrorEditions = () => {
  const { isValidating, data } = useSWRImmutable("/api/mirror-editions")

  return { isLoading: isValidating, editions: data }
}

export default useMirrorEditions
