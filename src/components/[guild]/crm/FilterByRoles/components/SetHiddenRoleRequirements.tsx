import { Box, FormLabel, Stack, Text } from "@chakra-ui/react"
import LogicDivider from "components/[guild]/LogicDivider"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import AddRequirement from "components/create-guild/Requirements/components/AddRequirement"
import LogicFormControl from "components/create-guild/Requirements/components/LogicFormControl"
import RequirementEditableCard from "components/create-guild/Requirements/components/RequirementEditableCard"
import { AnimatePresence } from "framer-motion"
import { useFieldArray, useFormContext, useWatch } from "react-hook-form"
import { RequirementType } from "requirements"
import { Requirement } from "types"

const SetHiddenRoleRequirements = (): JSX.Element => {
  const { control, getValues, watch, setValue } = useFormContext()

  const logic = useWatch({ name: "logic" })

  const { fields, append, update } = useFieldArray({
    name: "requirements",
    control,
    keyName: "formFieldId",
  })

  // Watching the nested fields too, so we can properly update the list
  const watchFieldArray = watch("requirements")
  const controlledFields = fields.map((field, index) => ({
    ...field,
    ...watchFieldArray[index],
  }))

  const removeReq = (index: number) => {
    setValue(
      `requirements`,
      watchFieldArray.filter((_, i) => i !== index)
    )
  }

  return (
    <Stack spacing="4" w="full">
      <Box>
        <FormLabel>Requirements</FormLabel>
        <Text colorScheme="gray">
          Query members by any requirements. If you only set one, you'll see the
          exact amounts users have that they satisfy it with! (e.g. ETH balance,
          Twitter followers)
        </Text>
      </Box>

      <LogicFormControl />
      <Stack spacing={0}>
        <AnimatePresence>
          {controlledFields.map((field: Requirement, i) => {
            const type: RequirementType = getValues(`requirements.${i}.type`)

            return (
              <CardMotionWrapper key={field.formFieldId}>
                <RequirementEditableCard
                  type={type}
                  field={field}
                  index={i}
                  removeRequirement={removeReq}
                  updateRequirement={update}
                  isEditDisabled={type === "PAYMENT"}
                />
                <LogicDivider logic={logic} />
              </CardMotionWrapper>
            )
          })}
          <AddRequirement onAdd={append} />
        </AnimatePresence>
      </Stack>
      {/* <FormErrorMessage id="requirements-error-message">
        {errors.requirements?.message as string}
      </FormErrorMessage> */}
    </Stack>
  )
}

export default SetHiddenRoleRequirements
