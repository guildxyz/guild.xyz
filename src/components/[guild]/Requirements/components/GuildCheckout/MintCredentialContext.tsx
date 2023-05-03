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
import {
  GuildCheckoutContextType,
  GuildCheckoutProvider,
  useGuildCheckoutContext,
} from "./components/GuildCheckoutContex"

export enum GuildAction {
  JOINED_GUILD,
  IS_OWNER,
  IS_ADMIN,
}

const MintCredentialContext = createContext<
  {
    credentialChain: Chain
    credentialType: GuildAction
    credentialImage: string
    error: string
    mintedTokenId?: number
    setMintedTokenId: Dispatch<SetStateAction<number>>
  } & GuildCheckoutContextType
>(undefined)

type Props = {
  credentialChain: Chain
  credentialType: GuildAction
}

const MintCredentialProviderComponent = ({
  credentialChain,
  credentialType,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const guildCheckoutContext = useGuildCheckoutContext()

  const { id } = useGuild()
  const { data: credentialImage, error } = useSWRImmutable(
    `/assets/credentials/image?guildId=${id}&guildAction=${credentialType}`
  )
  const [mintedTokenId, setMintedTokenId] = useState<number>(null)

  return (
    <MintCredentialContext.Provider
      value={{
        ...guildCheckoutContext,
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

const MintCredentialProvider = ({
  credentialChain,
  credentialType,
  children,
}: PropsWithChildren<Props>): JSX.Element => (
  <GuildCheckoutProvider>
    <MintCredentialProviderComponent
      credentialChain={credentialChain}
      credentialType={credentialType}
    >
      {children}
    </MintCredentialProviderComponent>
  </GuildCheckoutProvider>
)

const useMintCredentialContext = () => useContext(MintCredentialContext)

export { MintCredentialProvider, useMintCredentialContext }
