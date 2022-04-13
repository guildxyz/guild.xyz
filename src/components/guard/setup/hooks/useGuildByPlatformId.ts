import { useEffect } from "react"
import useSWR from "swr"
import { Guild } from "types"

const useGuildByPlatformId = (platformId: string, setValue: any) => {
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

  useEffect(() => {
    if (!data.roles) return

    const hasFreeEntry = data.roles.some((role) =>
      role.requirements.some((req) => req.type === "FREE")
    )

    if (!hasFreeEntry) {
      setValue("roles", [
        {
          guildId: data.id,
          ...(data.platforms?.[0]
            ? {
                platform: data.platforms[0].type,
                platformId: data.platforms[0].platformId,
              }
            : {}),
          name: "Verified",
          description: "",
          logic: "AND",
          requirements: [{ type: "FREE" }],
          imageUrl: "/guildLogos/0.svg",
        },
      ])
    } else {
      setValue("roles", undefined)
    }
  }, [data.roles])

  return data
}

export default useGuildByPlatformId
