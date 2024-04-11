import { Collapse, Flex, Stack } from "@chakra-ui/react"
import Button from "components/common/Button"
import RadioButtonGroup from "components/common/RadioButtonGroup"
import { useState } from "react"
import DynamicAmount from "./DynamicAmount"
import StaticAmount from "./StaticAmount"

const TokenAmountStep = ({ onContinue }: { onContinue: () => void }) => {
  const [value, setValue] = useState("dynamic")

  const options = [
    {
      label: "Dynamic amount",
      value: "dynamic",
    },
    {
      label: "Static amount",
      value: "static",
      disabled: "Soon",
    },
  ]

  const [isCollapsed, setIsCollapsed] = useState(false)

  const collapseAndExecute = (callback: () => void) => {
    setIsCollapsed(true)
    setTimeout(() => {
      callback()
      setTimeout(() => setIsCollapsed(false), 100)
    }, 100)
  }

  return (
    <Stack gap={5}>
      <RadioButtonGroup
        options={options}
        value={value}
        onChange={() => {}}
        chakraStyles={{
          spacing: 1.5,
          mt: 2,
          size: "sm",
          width: "full",
          colorScheme: "primary",
          mb: -2,
        }}
      />

      <Collapse startingHeight={150} animateOpacity in={!isCollapsed}>
        <Stack gap={5}>
          {value === "static" ? <StaticAmount /> : <DynamicAmount />}
        </Stack>
      </Collapse>

      <Flex justifyContent={"flex-end"} mt="4">
        <Button isDisabled={false} colorScheme="primary" onClick={onContinue}>
          Continue
        </Button>
      </Flex>
    </Stack>
  )
}

export default TokenAmountStep
