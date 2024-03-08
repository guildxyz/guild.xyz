import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import DataBlock from "components/common/DataBlock"
import useDebouncedState from "hooks/useDebouncedState"
import FarcasterCast from "./components/FarcasterCast"
import useFarcasterCast from "./hooks/useFarcasterCast"
import { useFarcasterUser } from "./hooks/useFarcasterUsers"

const FarcasterRequirement = (props: RequirementProps) => {
  const requirement = useRequirementContext()

  const { data: farcasterUser } = useFarcasterUser(requirement.data?.id)
  const debouncedHash = useDebouncedState(requirement.data?.hash)
  const debouncedUrl = useDebouncedState(requirement.data?.url)

  const {
    data: cast,
    isLoading: isCastLoading,
    error: castError,
  } = useFarcasterCast(debouncedHash, debouncedUrl)

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
                {requirement.type === "FARCASTER_LIKE" ? "Like" : "Recast"}
                <>
                  {" this cast: "}
                  <FarcasterCast
                    size="sm"
                    cast={cast}
                    loading={isCastLoading}
                    error={castError}
                  />
                </>
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
