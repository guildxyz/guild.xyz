import useSWRImmutable from "swr/immutable"
import { MirrorEdition } from "types"

const useMirrorEditions = () => {
  const { isValidating, data } = useSWRImmutable<Array<MirrorEdition>>(
    "/api/mirror-editions"
  )

  return { isLoading: isValidating, editions: data }
}

export default useMirrorEditions
