import { Img, useDisclosure } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import useMembership from "components/explorer/hooks/useMembership"
import { ConnectPolygonIDModal } from "requirements/PolygonID/components/ConnectPolygonID"
import { useAccount } from "wagmi"
import JoinStep from "./JoinStep"

const ConnectPolygonIDJoinStep = (): JSX.Element => {
  const { isConnected } = useAccount()

  const { roles } = useGuild()
  const requirements = roles?.flatMap((role) => role.requirements) ?? []
  const polygonIDRequirements = requirements
    ?.filter((req) => req.type === "POLYGON_ID_BASIC")
    .map((req) => req.id)

  const { membership } = useMembership()
  const requirementAccesses = membership?.roles?.flatMap((role) =>
    role.requirements?.filter((req) => req.access)
  )

  const isPIDConnected = requirementAccesses?.some(
    (reqAccess) =>
      polygonIDRequirements.includes(reqAccess.requirementId) && reqAccess.access
  )

  const { onOpen, onClose, isOpen } = useDisclosure()

  if (!polygonIDRequirements?.length) return null

  return (
    <>
      <JoinStep
        isDone={isPIDConnected}
        colorScheme="purple"
        icon={<Img src="/requirementLogos/polygonId_white.svg" width="1.5em" />}
        title="Connect PolygonID"
        buttonLabel={isPIDConnected ? "Connected" : "Connect"}
        onClick={onOpen}
        isDisabled={!isConnected && "Connect wallet first"}
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
