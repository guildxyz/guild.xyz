import useSWRImmutable from "swr/immutable"
import { MirrorEdition } from "types"

const useMirrorEditions = () => {
  const { isValidating, data } = useSWRImmutable<Array<MirrorEdition>>(
    process.env.NEXT_PUBLIC_MIRROR_API
  )

  return { isLoading: isValidating, editions: data }
}

export default useMirrorEditions
