import { HStack, TabsProps, Tag, Text, Tooltip } from "@chakra-ui/react"
import Tabs from "../Tabs"
import TabButton from "../Tabs/components/TabButton"

type Props = {
  submissionCount: number | undefined
} & Omit<TabsProps, "children">

const FormResponsesTabs = ({ submissionCount, ...rest }: Props): JSX.Element => (
  <Tabs {...rest}>
    <TabButton isActive>
      <HStack spacing={1.5}>
        <Text as="span">Responses</Text>
        <Tooltip
          label={`${submissionCount} responses`}
          hasArrow
          isDisabled={(submissionCount ?? 0) < 1000}
        >
          <Tag size="sm" color="inherit">
            {new Intl.NumberFormat("en", { notation: "compact" }).format(
              submissionCount ?? 0
            )}
          </Tag>
        </Tooltip>
      </HStack>
    </TabButton>
    <Tooltip label="Soon" hasArrow shouldWrapChildren>
      <TabButton isDisabled>Summary</TabButton>
    </Tooltip>
  </Tabs>
)
export default FormResponsesTabs
