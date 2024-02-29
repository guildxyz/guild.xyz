import { Icon } from "@chakra-ui/react"
import Requirement from "components/[guild]/Requirements/components/Requirement"
import Card from "components/common/Card"
import DataBlock from "components/common/DataBlock"
import { Warning } from "phosphor-react"
import { PropsWithChildren } from "react"

type Props = {
  type: string
}

const UnsupportedRequirementTypeCard = ({
  type,
  children,
}: PropsWithChildren<Props>) => (
  <Card px="6" py="4" pr="8" pos="relative">
    <Requirement image={<Icon as={Warning} boxSize={5} color="orange.300" />}>
      {`Unsupported requirement type: `}
      <DataBlock>{type}</DataBlock>
    </Requirement>
    {children}
  </Card>
)

export default UnsupportedRequirementTypeCard
