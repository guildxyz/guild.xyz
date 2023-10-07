import DataBlock from "components/[guild]/Requirements/components/DataBlock"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import { useFarcasterUser } from "./hooks/useFarcasterUsers"

const FarcasterRequirement = (props: RequirementProps) => {
  const requirement = useRequirementContext()

  const { data: farcasterUser } = useFarcasterUser(requirement.data?.id)

  return (
    <Requirement
      image={farcasterUser?.img || "requirementLogos/farcaster.png"}
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
            return <>FARCASTER_LIKE</>
          case "FARCASTER_RECAST":
            return <>FARCASTER_RECAST</>
          default:
            return <>Have a Farcaster profile</>
        }
      })()}
    </Requirement>
  )
}
export default FarcasterRequirement
