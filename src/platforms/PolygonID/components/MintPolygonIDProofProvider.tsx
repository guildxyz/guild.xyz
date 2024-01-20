import { useDisclosure } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import dynamic from "next/dynamic"
import { PropsWithChildren, createContext, useContext } from "react"
import { PlatformType } from "types"

const DynamicConnectDIDModal = dynamic(() => import("./ConnectDIDModal"))
const DynamicMintPolygonIDProofModal = dynamic(
  () => import("./MintPolygonIDProofModal")
)

const MintPolygonIDProofContext = createContext<{
  isConnectDIDModalOpen: boolean
  onConnectDIDModalOpen: () => void
  onConnectDIDModalClose: () => void
  isMintPolygonIDProofModalOpen: boolean
  onMintPolygonIDProofModalOpen: () => void
  onMintPolygonIDProofModalClose: () => void
}>(undefined)

const MintPolygonIDProofProvider = ({ children }: PropsWithChildren<unknown>) => {
  const { guildPlatforms } = useGuild()
  const {
    isOpen: isConnectDIDModalOpen,
    onOpen: onConnectDIDModalOpen,
    onClose: onConnectDIDModalClose,
  } = useDisclosure()
  const {
    isOpen: isMintPolygonIDProofModalOpen,
    onOpen: onMintPolygonIDProofModalOpen,
    onClose: onMintPolygonIDProofModalClose,
  } = useDisclosure()

  return (
    <MintPolygonIDProofContext.Provider
      value={{
        isConnectDIDModalOpen,
        onConnectDIDModalOpen,
        onConnectDIDModalClose,
        isMintPolygonIDProofModalOpen,
        onMintPolygonIDProofModalOpen,
        onMintPolygonIDProofModalClose,
      }}
    >
      {children}

      {guildPlatforms.find((gp) => gp.platformId === PlatformType.POLYGON_ID) && (
        <>
          <DynamicConnectDIDModal
            isOpen={isConnectDIDModalOpen}
            onClose={onConnectDIDModalClose}
          />
          <DynamicMintPolygonIDProofModal
            isOpen={isMintPolygonIDProofModalOpen}
            onClose={onMintPolygonIDProofModalClose}
          />
        </>
      )}
    </MintPolygonIDProofContext.Provider>
  )
}

const useMintPolygonIDProofContext = () => useContext(MintPolygonIDProofContext)

export { MintPolygonIDProofProvider, useMintPolygonIDProofContext }
