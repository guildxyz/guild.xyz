import { Img, useDisclosure } from "@chakra-ui/react"
import useSWRWithOptionalAuth from "hooks/useSWRWithOptionalAuth"
import { ConnectPolygonIDModal } from "requirements/PolygonID/components/ConnectPolygonID"
import { useAccount } from "wagmi"
import JoinStep from "./JoinStep"

const ConnectPolygonIDJoinStep = (): JSX.Element => {
  const { isConnected } = useAccount()

  const { data: isDone, isLoading } = useSWRWithOptionalAuth(
    `/v2/util/gate-proof-existence/POLYGON_ID_BASIC_MAIN`
  )

  const { onOpen, onClose, isOpen } = useDisclosure()

  return (
    <>
      <JoinStep
        isDone={isDone}
        colorScheme="purple"
        icon={<Img src="/requirementLogos/polygonId_white.svg" width="1.5em" />}
        title="Connect PolygonID"
        buttonLabel={isDone ? "Connected" : "Connect"}
        onClick={onOpen}
        isDisabled={!isConnected && "Connect wallet first"}
        isLoading={isLoading}
      />

      <ConnectPolygonIDModal
        type="POLYGON_ID_BASIC_MAIN"
        data={{}}
        onClose={onClose}
        isOpen={isOpen}
      />
    </>
  )
}

export default ConnectPolygonIDJoinStep
