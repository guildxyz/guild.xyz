import useGuild from "components/[guild]/hooks/useGuild"
import { Chain } from "connectors"
import { createContext, PropsWithChildren, useContext } from "react"
import useSWRImmutable from "swr/immutable"

export enum GuildAction {
  JOINED_GUILD,
  IS_OWNER,
  IS_ADMIN,
}

const MintCredentialContext = createContext<{
  credentialChain: Chain
  credentialType: GuildAction
  credentialImage: string
  error: string
}>(undefined)

type Props = {
  credentialChain: Chain
  credentialType: GuildAction
}

const MintCredentialProvider = ({
  credentialChain,
  credentialType,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const { id } = useGuild()
  const { data: credentialImage, error } = useSWRImmutable(
    `/assets/credentials/image?guildId=${id}&guildAction=${credentialType}`
  )

  return (
    <MintCredentialContext.Provider
      value={{
        credentialChain,
        credentialType,
        credentialImage,
        error,
      }}
    >
      {children}
    </MintCredentialContext.Provider>
  )
}

const useMintCredentialContext = () => useContext(MintCredentialContext)

export { MintCredentialProvider, useMintCredentialContext }
