import { Box } from "@chakra-ui/react"
import ColorCard from "components/common/ColorCard"
import RequirementChainTypeText from "components/create-guild/Requirements/components/RequirementChainTypeText"
import { PropsWithChildren } from "react"
import { Requirement, RequirementTypeColors, Rest } from "types"

type Props = {
  requirement: Requirement
} & Rest

const RequirementCard = ({
  requirement,
  children,
  ...rest
}: PropsWithChildren<Props>): JSX.Element => (
  <ColorCard
    color={RequirementTypeColors[requirement?.type]}
    pr={"var(--chakra-space-32) !important"}
    boxShadow="none"
    alignItems="left"
    {...rest}
  >
    <Box w="full">{children}</Box>

    <RequirementChainTypeText
      requirementChain={requirement?.chain}
      requirementType={requirement?.type}
      bottom="-px"
      right="-px"
      borderTopLeftRadius="xl"
      borderBottomRightRadius="xl"
    />
  </ColorCard>
)

export default RequirementCard
