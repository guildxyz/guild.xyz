import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import useIsMember from "components/[guild]/hooks/useIsMember"
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
}

const MintCredentialProviderComponent = ({
  credentialChain,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const guildCheckoutContext = useGuildCheckoutContext()

  const { id } = useGuild()
  const isMember = useIsMember()
  const { isOwner, isAdmin } = useGuildPermission()

  const credentialType = isOwner
    ? GuildAction.IS_OWNER
    : isAdmin
    ? GuildAction.IS_ADMIN
    : isMember
    ? GuildAction.JOINED_GUILD
    : null

  const { data: credentialImage, error } = useSWRImmutable(
    credentialType
      ? `/assets/credentials/image?guildId=${id}&guildAction=${credentialType}`
      : null
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
  children,
}: PropsWithChildren<Props>): JSX.Element => (
  <GuildCheckoutProvider>
    <MintCredentialProviderComponent credentialChain={credentialChain}>
      {children}
    </MintCredentialProviderComponent>
  </GuildCheckoutProvider>
)

const useMintCredentialContext = () => useContext(MintCredentialContext)

export { MintCredentialProvider, useMintCredentialContext }
