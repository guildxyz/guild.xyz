import { Icon, Link } from "@chakra-ui/react"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import DataBlock from "components/common/DataBlock"
import useDebouncedState from "hooks/useDebouncedState"
import { ArrowSquareOut } from "phosphor-react"
import FarcasterCast from "./components/FarcasterCast"
import useFarcasterCast from "./hooks/useFarcasterCast"
import { useFarcasterChannel } from "./hooks/useFarcasterChannels"
import { useFarcasterUser } from "./hooks/useFarcasterUsers"

const FarcasterRequirement = (props: RequirementProps) => {
  const requirement = useRequirementContext()

  const { data: farcasterUser } = useFarcasterUser(
    ["FARCASTER_FOLLOW", "FARCASTER_FOLLOWED_BY"].includes(requirement.type)
      ? requirement.data?.id
      : undefined
  )
  const { data: farcasterChannel } = useFarcasterChannel(
    requirement.type === "FARCASTER_FOLLOW_CHANNEL"
      ? requirement.data?.id
      : undefined
  )

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
          case "FARCASTER_FOLLOW_CHANNEL":
            return (
              <>
                {`Follow the `}
                <Link
                  href={`https://warpcast.com/~/channel/${requirement.data.id}`}
                  isExternal
                  colorScheme="blue"
                  fontWeight="medium"
                >
                  {farcasterChannel?.label ?? requirement.data.id}
                  <Icon as={ArrowSquareOut} mx="1" />
                </Link>
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
