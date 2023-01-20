import { Img, Link } from "@chakra-ui/react"
import DataBlock from "components/[guild]/Requirements/components/DataBlock"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import use101Courses from "./hooks/use101Courses"

const HundredNOneRequirement = ({ ...rest }: RequirementProps) => {
  const requirement = useRequirementContext()

  const { data, isValidating, error } = use101Courses()

  const badge = data?.find(
    (option) => option.onChainId.toString() === requirement.data.id
  )

  return (
    <Requirement
      isNegated={requirement.isNegated}
      image={
        <Img
          src={
            badge?.imageUri?.replace("ipfs://", "https://ipfs.fleek.co/ipfs/") ??
            "/requirementLogos/101.png"
          }
        />
      }
      isImageLoading={isValidating}
      {...rest}
    >
      {`Have the badge of the `}
      {!badge || isValidating || error ? (
        <DataBlock
          isLoading={isValidating}
          error={error && "API error, please contact 101.xyz to report."}
        >
          {`#${requirement.data.id}`}
        </DataBlock>
      ) : (
        <Link
          href={`https://101.xyz/course/${badge?.courses?.[0]?.id}`}
          isExternal
          display="inline"
          colorScheme="blue"
          fontWeight="medium"
        >
          {badge?.courses?.[0]?.title.trim()}
        </Link>
      )}

      {` 101 course `}
    </Requirement>
  )
}

export default HundredNOneRequirement
