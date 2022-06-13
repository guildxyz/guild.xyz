import { createContext, PropsWithChildren, useContext } from "react"

const RolePlatformContext = createContext(null)

type Props = {
  rolePlatform: any // TODO
}

const RolePlatformProvider = ({
  children,
  rolePlatform,
}: PropsWithChildren<Props>) => (
  <RolePlatformContext.Provider value={rolePlatform}>
    {children}
  </RolePlatformContext.Provider>
)

const useRolePlatrform = () => useContext(RolePlatformContext)

export { RolePlatformProvider, useRolePlatrform }
