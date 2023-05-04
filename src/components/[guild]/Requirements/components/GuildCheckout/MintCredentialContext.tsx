import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import useIsMember from "components/[guild]/hooks/useIsMember"
import useUser from "components/[guild]/hooks/useUser"
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
    credentialType: GuildAction
    credentialImage: string
    error: string
    mintedTokenId?: number
    setMintedTokenId: Dispatch<SetStateAction<number>>
  } & GuildCheckoutContextType
>(undefined)

const MintCredentialProviderComponent = ({
  children,
}: PropsWithChildren<unknown>): JSX.Element => {
  const guildCheckoutContext = useGuildCheckoutContext()

  const { id } = useGuild()
  const isMember = useIsMember()
  const { isOwner, isAdmin } = useGuildPermission()
  const { isSuperAdmin } = useUser()

  const credentialType = isOwner
    ? GuildAction.IS_OWNER
    : isAdmin && !isSuperAdmin
    ? GuildAction.IS_ADMIN
    : isMember
    ? GuildAction.JOINED_GUILD
    : null

  const { data: credentialImage, error } = useSWRImmutable(
    id && typeof credentialType === "number"
      ? `/assets/credentials/image?guildId=${id}&guildAction=${credentialType}`
      : null
  )

  const [mintedTokenId, setMintedTokenId] = useState<number>(null)

  return (
    <MintCredentialContext.Provider
      value={{
        ...guildCheckoutContext,
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
  children,
}: PropsWithChildren<unknown>): JSX.Element => (
  <GuildCheckoutProvider>
    <MintCredentialProviderComponent>{children}</MintCredentialProviderComponent>
  </GuildCheckoutProvider>
)

const useMintCredentialContext = () => useContext(MintCredentialContext)

export { MintCredentialProvider, useMintCredentialContext }
