import { Tooltip } from "@chakra-ui/react"
import Tabs from "../Tabs"
import TabButton from "../Tabs/components/TabButton"

const FormResponsesTabs = ({ ...rest }): JSX.Element => (
  <Tabs {...rest}>
    <TabButton isActive>Individual</TabButton>
    <Tooltip label="Soon" hasArrow shouldWrapChildren>
      <TabButton isDisabled>Summary</TabButton>
    </Tooltip>
  </Tabs>
)
export default FormResponsesTabs
