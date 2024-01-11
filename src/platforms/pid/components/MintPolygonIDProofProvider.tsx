import { useDisclosure } from "@chakra-ui/react"
import { PropsWithChildren, createContext, useContext } from "react"
import ConnectDIDModal from "./ConnectDIDModal"
import MintPolygonIDProofModal from "./MintPolygonIDProofModal"

const MintPolygonIDProofContext = createContext<{
  isConnectDIDModalOpen: boolean
  onConnectDIDModalOpen: () => void
  onConnectDIDModalClose: () => void
  isMintPolygonIDProofModalOpen: boolean
  onMintPolygonIDProofModalOpen: () => void
  onMintPolygonIDProofModalClose: () => void
}>(undefined)

const MintPolygonIDProofProvider = ({ children }: PropsWithChildren<unknown>) => {
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

      <ConnectDIDModal
        isOpen={isConnectDIDModalOpen}
        onClose={onConnectDIDModalClose}
      />
      <MintPolygonIDProofModal
        isOpen={isMintPolygonIDProofModalOpen}
        onClose={onMintPolygonIDProofModalClose}
      />
    </MintPolygonIDProofContext.Provider>
  )
}

const useMintPolygonIDProofContext = () => useContext(MintPolygonIDProofContext)

export { MintPolygonIDProofProvider, useMintPolygonIDProofContext }
