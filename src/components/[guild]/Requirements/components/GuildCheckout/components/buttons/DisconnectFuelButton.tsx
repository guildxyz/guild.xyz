import { Tooltip } from "@chakra-ui/react"
import Button from "components/common/Button"
import { PropsWithChildren } from "react"

const DisconnectFuelButton = ({ children }: PropsWithChildren<unknown>) => (
  <Tooltip label="Disconnect your Fuel wallet first" hasArrow>
    <Button size="lg" isDisabled colorScheme="blue" w="full">
      {children}
    </Button>
  </Tooltip>
)
export default DisconnectFuelButton
