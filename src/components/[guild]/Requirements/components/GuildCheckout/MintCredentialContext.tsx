import useGuild from "components/[guild]/hooks/useGuild"
import { Chain } from "connectors"
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from "react"
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
  mintedTokenId?: number
  setMintedTokenId: Dispatch<SetStateAction<number>>
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
  const [mintedTokenId, setMintedTokenId] = useState<number>(null)

  return (
    <MintCredentialContext.Provider
      value={{
        credentialChain,
        credentialType,
        credentialImage,
        error,
        mintedTokenId,
        setMintedTokenId,
      }}
    >
      {children}
    </MintCredentialContext.Provider>
  )
}

const useMintCredentialContext = () => useContext(MintCredentialContext)

export { MintCredentialProvider, useMintCredentialContext }
