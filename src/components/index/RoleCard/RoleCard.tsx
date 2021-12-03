import { HStack, Tag, TagLabel, TagLeftIcon, Tooltip } from "@chakra-ui/react"
import DisplayCard from "components/common/DisplayCard"
import Link from "components/common/Link"
import { Users } from "phosphor-react"
import { PropsWithChildren } from "react"
import { Role } from "temporaryData/types"
import { Rest } from "types"
import pluralize from "utils/pluralize"
import useRequirementLabels from "../../../hooks/useRequirementLabels"

type Props = {
  roleData: Role
} & Rest

const RoleCard = ({
  roleData,
  children,
  ...rest
}: PropsWithChildren<Props>): JSX.Element => {
  const requirementLabels = useRequirementLabels(roleData.requirements)

  return (
    <Link
      href={`/role/${roleData.urlName}`}
      _hover={{ textDecor: "none" }}
      borderRadius="2xl"
      w="full"
    >
      <DisplayCard image={roleData.imageUrl} title={roleData.name} {...rest}>
        <>
          <HStack zIndex="1" spacing={1.5} maxW="full">
            <Tag as="li" minW="max-content">
              <TagLeftIcon as={Users} mr={1} />
              <TagLabel>{roleData.members?.length || 0}</TagLabel>
            </Tag>
            <Tooltip label={requirementLabels}>
              <Tag as="li">
                <TagLabel>
                  {pluralize(roleData.requirements?.length ?? 0, "requirement")}
                </TagLabel>
              </Tag>
            </Tooltip>
          </HStack>
          {children}
        </>
      </DisplayCard>
    </Link>
  )
}

export default RoleCard
