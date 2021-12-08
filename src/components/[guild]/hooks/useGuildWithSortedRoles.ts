import { useRouter } from "next/router"
import useSWRImmutable from "swr/immutable"
import { Guild, PlatformName, Role } from "types"

const useGuildWithSortedRoles = (): Guild & {
  sortedRoles: Record<PlatformName, Record<string, Array<Role>>>
} => {
  const router = useRouter()

  const { data } = useSWRImmutable(`/guild/urlName/${router.query.guild}`)

  // Sorting roles by platform
  const originalRoles = data?.roles ? [...data.roles] : []

  // Defining a new prop on the data object
  data.sortedRoles = {
    DISCORD: {},
    TELEGRAM: {},
  }

  originalRoles.forEach((roleData) => {
    if (!roleData.role.rolePlatforms?.[0]?.platformId) return

    const platformName =
      roleData.role.rolePlatforms[0].platform.name === "DISCORD_CUSTOM"
        ? "DISCORD"
        : roleData.role.rolePlatforms[0].platform.name
    const platformId = roleData.role.rolePlatforms[0].platformId.toString()

    if (Array.isArray(data.sortedRoles[platformName][platformId])) {
      data.sortedRoles[platformName][platformId].push(roleData.role)
    } else {
      data.sortedRoles[platformName][platformId] = [roleData.role]
    }
  })

  return data
}

export default useGuildWithSortedRoles
