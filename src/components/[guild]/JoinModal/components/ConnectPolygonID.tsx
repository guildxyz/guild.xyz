import { Divider, Img, useDisclosure } from "@chakra-ui/react"
import useAccess from "components/[guild]/hooks/useAccess"
import useGuild from "components/[guild]/hooks/useGuild"
import { ConnectPolygonIDModal } from "requirements/PolygonId/components/ConnectPolygonID"
import JoinStep from "./JoinStep"

const ConnectPolygonID = (): JSX.Element => {
  const { roles } = useGuild()
  const requirements = roles?.flatMap((role) => role.requirements) ?? []
  const polygonIDRequirements = requirements
    ?.filter((req) => req.type === "POLYGON_ID_BASIC")
    .map((req) => req.id)

  const { onOpen, onClose, isOpen } = useDisclosure()
  const { data: accesses } = useAccess()
  const requirementAccesses = accesses?.flatMap((access) => access.requirements)

  const isConnected = requirementAccesses?.some((reqAccess) =>
    polygonIDRequirements.includes(reqAccess.requirementId && reqAccess.access)
  )

  if (!polygonIDRequirements?.length) return null

  return (
    <>
      <Divider />
      <JoinStep
        isDone={isConnected}
        colorScheme="purple"
        icon={<Img src="requirementLogos/polygonId_white.svg" width="1.5em" />}
        title="Connect PolygonID"
        buttonLabel={isConnected ? "Connected" : "Connect"}
        datadogActionName={"Connect PolygonID (JoinModal)"}
        onClick={onOpen}
      />

      <ConnectPolygonIDModal
        type="POLYGON_ID_BASIC"
        data={{}}
        onClose={onClose}
        isOpen={isOpen}
      />
    </>
  )
}

export default ConnectPolygonID
