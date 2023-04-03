import { Chain } from "connectors"
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from "react"

export enum GuildAction {
  JOINED_GUILD,
  IS_OWNER,
  IS_ADMIN,
}

type GuildCredentialAttribute =
  | {
      trait_type: "Type"
      value: (typeof GuildAction)[number]
    }
  | {
      trait_type: "Guild"
      value: string
    }
  | {
      trait_type: "User ID"
      value: string
    }
  | {
      trait_type: "Date"
      display_type: "date"
      value: number
    }

// Constructed according to the Opensea metadata standards: https://docs.opensea.io/docs/metadata-standards#metadata-structure
export type GuildCredentialMetadata = {
  name: string
  description: string
  // animation_url: string
  image: string
  attributes: GuildCredentialAttribute[]
}

const MintCredentialContext = createContext<{
  credentialChain: Chain
  credentialType: GuildAction
  image?: File
  setImage: Dispatch<SetStateAction<File>>
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
  const [image, setImage] = useState<File>(null)

  return (
    <MintCredentialContext.Provider
      value={{
        credentialChain,
        credentialType,
        image,
        setImage,
      }}
    >
      {children}
    </MintCredentialContext.Provider>
  )
}

const useMintCredentialContext = () => useContext(MintCredentialContext)

export { MintCredentialProvider, useMintCredentialContext }
