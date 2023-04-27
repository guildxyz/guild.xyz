import { Chain } from "connectors"
import { createContext, PropsWithChildren, useContext } from "react"

export enum GuildAction {
  JOINED_GUILD,
  IS_OWNER,
  IS_ADMIN,
}

const MintCredentialContext = createContext<{
  credentialChain: Chain
  credentialType: GuildAction
}>(undefined)

type Props = {
  credentialChain: Chain
  credentialType: GuildAction
}

const MintCredentialProvider = ({
  credentialChain,
  credentialType,
  children,
}: PropsWithChildren<Props>): JSX.Element => (
  <MintCredentialContext.Provider
    value={{
      credentialChain,
      credentialType,
    }}
  >
    {children}
  </MintCredentialContext.Provider>
)

const useMintCredentialContext = () => useContext(MintCredentialContext)

export { MintCredentialProvider, useMintCredentialContext }
