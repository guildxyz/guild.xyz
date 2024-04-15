import { Img, useDisclosure } from "@chakra-ui/react"
import useWeb3ConnectionManager from "components/_app/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import useSWRWithOptionalAuth from "hooks/useSWRWithOptionalAuth"
import { ConnectPolygonIDModal } from "requirements/PolygonID/components/ConnectPolygonID"
import JoinStep from "./JoinStep"

const ConnectPolygonIDJoinStep = (): JSX.Element => {
  const { isWeb3Connected } = useWeb3ConnectionManager()

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
        isDisabled={!isWeb3Connected && "Connect wallet first"}
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
