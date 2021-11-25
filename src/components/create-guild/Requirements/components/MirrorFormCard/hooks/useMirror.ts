import useSWRImmutable from "swr/immutable"

const fetchMirrorEditions = async () =>
  fetch("/api/mirror-editions").then((data) => data.json())

const useMirrorEditions = () => {
  const { isValidating, data } = useSWRImmutable("mirror", fetchMirrorEditions)

  return { isLoading: isValidating, editions: data }
}

export default useMirrorEditions
