import { Flex, Stack } from "@chakra-ui/react"
import Button from "components/common/Button"
import RadioButtonGroup from "components/common/RadioButtonGroup"
import { useState } from "react"
import DynamicAmount from "./DynamicAmount"
import StaticAmount from "./StaticAmount"

const TokenAmountStep = ({ onContinue }: { onContinue: () => void }) => {
  const [value, setValue] = useState("static")

  const options = [
    {
      label: "Static amount",
      value: "static",
    },
    {
      label: "Dynamic amount",
      value: "dynamic",
    },
  ]

  return (
    <Stack gap={5}>
      <RadioButtonGroup
        options={options}
        value={value}
        onChange={(newValue) => setValue(newValue)}
        chakraStyles={{
          spacing: 1.5,
          mt: 2,
          size: "sm",
          width: "full",
          colorScheme: "primary",
        }}
      />

      {value === "static" ? <StaticAmount /> : <DynamicAmount />}

      <Flex justifyContent={"flex-end"} mt="4">
        <Button isDisabled={false} colorScheme="primary" onClick={onContinue}>
          Continue
        </Button>
      </Flex>
    </Stack>
  )
}

export default TokenAmountStep
