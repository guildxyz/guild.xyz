import React, { createContext, PropsWithChildren, useContext } from "react"
import { Guild } from "temporaryData/types"

type Props = {
  data: Guild
}

const GuildContext = createContext<Guild | null>(null)

const GuildProvider = ({
  data,
  children,
}: PropsWithChildren<Props>): JSX.Element => (
  <GuildContext.Provider
    value={{
      ...data,
    }}
  >
    {children}
  </GuildContext.Provider>
)

const useGuild = () => useContext(GuildContext)

export { useGuild, GuildProvider }
