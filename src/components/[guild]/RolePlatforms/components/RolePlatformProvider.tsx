import { createContext, PropsWithChildren, useContext } from "react"
import { RoleFormType } from "types"

const RolePlatformContext =
  // @ts-expect-error TODO: fix this error originating from strictNullChecks
  createContext<RoleFormType["rolePlatforms"][number]>(null)

type Props = {
  // @ts-expect-error TODO: fix this error originating from strictNullChecks
  rolePlatform: RoleFormType["rolePlatforms"][number]
}

const RolePlatformProvider = ({
  children,
  rolePlatform,
}: PropsWithChildren<Props>) => (
  <RolePlatformContext.Provider value={rolePlatform}>
    {children}
  </RolePlatformContext.Provider>
)

const useRolePlatform = () => useContext(RolePlatformContext)

export { RolePlatformProvider, useRolePlatform }
