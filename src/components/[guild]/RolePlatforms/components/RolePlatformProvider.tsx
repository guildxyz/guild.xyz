import { PropsWithChildren, createContext, useContext } from "react"
import { RoleFormType } from "types"

const RolePlatformContext =
  createContext<RoleFormType["rolePlatforms"][number]>(null)

type Props = {
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
