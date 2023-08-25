import { Img, useDisclosure } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import useAccess from "components/[guild]/hooks/useAccess"
import useGuild from "components/[guild]/hooks/useGuild"
import { ConnectPolygonIDModal } from "requirements/PolygonId/components/ConnectPolygonID"
import JoinStep from "./JoinStep"

const ConnectPolygonIDJoinStep = (): JSX.Element => {
  const { isActive } = useWeb3React()

  const { roles } = useGuild()
  const requirements = roles?.flatMap((role) => role.requirements) ?? []
  const polygonIDRequirements = requirements
    ?.filter((req) => req.type === "POLYGON_ID_BASIC")
    .map((req) => req.id)

  const {
    data: { requirementAccesses },
  } = useAccess()

  const isConnected = requirementAccesses?.some(
    (reqAccess) =>
      polygonIDRequirements.includes(reqAccess.requirementId) && reqAccess.access
  )

  const { onOpen, onClose, isOpen } = useDisclosure()

  if (!polygonIDRequirements?.length) return null

  return (
    <>
      <JoinStep
        isDone={isConnected}
        colorScheme="purple"
        icon={<Img src="requirementLogos/polygonId_white.svg" width="1.5em" />}
        title="Connect PolygonID"
        buttonLabel={isConnected ? "Connected" : "Connect"}
        onClick={onOpen}
        isDisabled={!isActive && "Connect wallet first"}
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
