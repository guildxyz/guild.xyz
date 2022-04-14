import { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import useSWR from "swr"
import { Guild } from "types"

const useGuildByPlatformId = (platformId: string) => {
  const { setValue } = useFormContext()

  const shouldFetch = platformId?.length > 0
  const { data } = useSWR<Partial<Guild>>(
    shouldFetch ? `/guild/platformId/${platformId}` : null,
    { fallbackData: {} }
  )

  useEffect(() => {
    if (data.id) {
      setValue("requirements", undefined)
      setValue("imageUrl", undefined, { shouldTouch: true })
      setValue("name", undefined, { shouldTouch: true })
    }
  }, [data.id])

  return data
}

export default useGuildByPlatformId
