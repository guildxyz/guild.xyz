import { Box, FormLabel, HStack } from "@chakra-ui/react"
import { useState } from "react"
import DynamicPointsAmountForm from "./components/DynamicPointsAmountForm"
import PointsAmountTypeSelector from "./components/PointsAmountTypeSelector"
import StaticPointsAmountForm from "./components/StaticPointsAmountForm"

const SetPointsAmount = ({
  imageUrl,
  name,
  baseFieldPath,
  defaultDynamicAmount = false,
  /**
   * Temporary disable switching at edit & when selecting as existing platform, as it
   * would require some more changes to the form state management (mainly to prefill
   * missing dynamicValue values as we do in the AddPointsPanel onSubmit). We should
   * be able to enable it easily in the future
   */
  optionsDisabled = null,
}) => {
  const [type, setType] = useState(defaultDynamicAmount ? "dynamic" : "static")

  return (
    <Box>
      <HStack justifyContent={"space-between"} mb="2">
        <FormLabel
          mb="0"
          fontWeight={type === "dynamic" ? "semibold" : "medium"}
        >{`How many ${name || "points"} to get?`}</FormLabel>
        <PointsAmountTypeSelector {...{ type, setType, optionsDisabled }} />
      </HStack>
      {type === "static" ? (
        <StaticPointsAmountForm {...{ imageUrl, baseFieldPath }} />
      ) : (
        <DynamicPointsAmountForm {...{ imageUrl, baseFieldPath }} />
      )}
    </Box>
  )
}

export default SetPointsAmount
