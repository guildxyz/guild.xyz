import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import DataBlock from "components/common/DataBlock"
import DataBlockWithCopy from "components/common/DataBlockWithCopy"
import shortenHex from "utils/shortenHex"
import { useFarcasterChannel } from "./hooks/useFarcasterChannels"
import { useFarcasterUser } from "./hooks/useFarcasterUsers"

const FarcasterRequirement = (props: RequirementProps) => {
  const requirement = useRequirementContext()

  const { data: farcasterUser } = useFarcasterUser(requirement.data?.id)
  const { data: farcasterChannel } = useFarcasterChannel(requirement.data?.id)

  return (
    <Requirement
      image={farcasterUser?.img || "/requirementLogos/farcaster.png"}
      {...props}
    >
      {(() => {
        switch (requirement.type) {
          case "FARCASTER_FOLLOW":
            return (
              <>
                {`Follow `}
                <DataBlock isLoading={!farcasterUser}>
                  {farcasterUser?.label ?? "Loading..."}
                </DataBlock>
                {` on Farcaster`}
              </>
            )
          case "FARCASTER_FOLLOWED_BY":
            return (
              <>
                {`Be followed by `}
                <DataBlock isLoading={!farcasterUser}>
                  {farcasterUser?.label ?? "Loading..."}
                </DataBlock>
                {` on Farcaster`}
              </>
            )
          case "FARCASTER_TOTAL_FOLLOWERS":
            return (
              <>{`Have at least ${requirement.data.min} followers on Farcaster`}</>
            )
          case "FARCASTER_LIKE":
          case "FARCASTER_RECAST":
            return (
              <>
                {`${requirement.type === "FARCASTER_LIKE" ? "Like" : "Recast"} the `}
                <DataBlockWithCopy text={requirement.data.hash}>
                  {shortenHex(requirement.data.hash, 3)}
                </DataBlockWithCopy>
                {` cast`}
              </>
            )
          case "FARCASTER_CHANNEL_FOLLOW":
            return (
              <>
                {`Follow the `}
                <DataBlock isLoading={!farcasterChannel}>
                  {farcasterChannel?.label ?? "Loading..."}
                </DataBlock>
                {` channel on Farcaster`}
              </>
            )
          default:
            return <>Have a Farcaster profile</>
        }
      })()}
    </Requirement>
  )
}
export default FarcasterRequirement
