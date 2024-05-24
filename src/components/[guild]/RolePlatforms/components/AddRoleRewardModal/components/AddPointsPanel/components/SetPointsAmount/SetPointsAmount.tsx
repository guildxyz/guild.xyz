import { Box, FormLabel, HStack } from "@chakra-ui/react"
import { useAddRewardContext } from "components/[guild]/AddRewardContext"
import { useState } from "react"
import { useFormContext } from "react-hook-form"
import DynamicPointsAmountForm from "./components/DynamicPointsAmountForm"
import PointsAmountTypeSelector from "./components/PointsAmountTypeSelector"
import StaticPointsAmountForm from "./components/StaticPointsAmountForm"

const SetPointsAmount = ({
  imageUrl,
  name,
  baseFieldPath,
  defaultDynamicAmount = false,
}) => {
  const [type, setType] = useState(defaultDynamicAmount ? "dynamic" : "static")

  const { setValue } = useFormContext()
  const { targetRoleId } = useAddRewardContext()

  const handleTypeChange = (newType: "dynamic" | "static") => {
    const dynamicAmountFieldPath = `${
      baseFieldPath ? baseFieldPath + "." : ""
    }dynamicAmount`

    if (newType === "dynamic" && !defaultDynamicAmount) {
      const defaultDynamic = {
        operation: {
          type: "LINEAR",
          params: {
            addition: 0,
            multiplier: 1,
            shouldFloorResult: true,
          },
          input: {
            type: "REQUIREMENT_AMOUNT",
            requirementId: null,
            roleId: targetRoleId,
          },
        },
      }
      setValue(dynamicAmountFieldPath, defaultDynamic)
    }
    if (newType === "static") {
      setValue(dynamicAmountFieldPath, null)
    }

    setType(newType)
  }

  return (
    <Box>
      <HStack justifyContent={"space-between"} mb="2">
        <FormLabel
          mb="0"
          fontWeight={type === "dynamic" ? "semibold" : "medium"}
        >{`How many ${name || "points"} to get?`}</FormLabel>
        <PointsAmountTypeSelector {...{ type, setType: handleTypeChange }} />
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
