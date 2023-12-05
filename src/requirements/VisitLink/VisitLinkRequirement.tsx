import { Icon, Text } from "@chakra-ui/react"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import Link from "components/common/Link"
import { LinkMetadata } from "pages/api/link-metadata"
import { Link as LinkIcon } from "phosphor-react"
import useSWRImmutable from "swr/immutable"

const VisitLinkRequirement = ({ ...props }: RequirementProps) => {
  const { data } = useRequirementContext()
  const { data: metadata } = useSWRImmutable<LinkMetadata>(data.link)

  return (
    <Requirement image={<Icon as={LinkIcon} boxSize={6} />} {...props}>
      <Text as="span">{`Visit link: `}</Text>
      <Link href={data.link} target="_blank">
        {metadata.title}
      </Link>
    </Requirement>
  )
}

export default VisitLinkRequirement
