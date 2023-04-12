import { Checkbox, Stack, Text, Wrap } from "@chakra-ui/react"
import { useRumAction } from "@datadog/rum-react-integration"
import Card from "components/common/Card"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import { SectionTitle } from "components/common/Section"
import LogicDivider from "components/[guild]/LogicDivider"
import { AnimatePresence } from "framer-motion"
import { useEffect, useMemo } from "react"
import { useFieldArray, useFormContext, useWatch } from "react-hook-form"
import { RequirementType } from "requirements"
import FreeRequirement from "requirements/Free/FreeRequirement"
import { Requirement } from "types"
import AddRequirement from "./components/AddRequirement"
import BalancyCounterWithPopover from "./components/BalancyCounter"
import LogicFormControl from "./components/LogicFormControl"
import RequirementEditableCard from "./components/RequirementEditableCard"
import useAddRequirementsFromQuery from "./hooks/useAddRequirementsFromQuery"

const SetRequirements = (): JSX.Element => {
  const addDatadogAction = useRumAction("trackingAppAction")
  const { control, getValues, watch, clearErrors, setValue } = useFormContext()

  const logic = useWatch({ name: "logic" })

  const { fields, append, replace, update } = useFieldArray({
    name: "requirements",
    control,
    keyName: "formFieldId",
  })

  const requirements = useWatch({ name: "requirements" })

  useEffect(() => {
    if (!requirements || requirements?.length === 0) {
      // setError("requirements", {
      //   message: "Set some requirements, or make the role free",
      // })
    } else {
      clearErrors("requirements")
    }
  }, [requirements])

  useAddRequirementsFromQuery(append)

  const addRequirement = (data) => {
    append(data)

    // Sending actions to datadog
    addDatadogAction("Added a requirement")
    addDatadogAction(`Added a requirement [${data.type}]`)
  }

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

  const freeEntry = useMemo(
    () => !!controlledFields?.find((requirement) => requirement.type === "FREE"),
    [controlledFields]
  )

  const onFreeEntryChange = (e) =>
    e.target.checked
      ? replace([{ type: "FREE", data: {}, chain: null, address: null }])
      : replace([])

  return (
    <Stack spacing="5" w="full">
      <Wrap spacing="3">
        <SectionTitle
          title="Requirements"
          titleRightElement={
            <>
              <Text as="span" fontWeight="normal" fontSize="sm" color="gray">
                {`- or `}
              </Text>
              <Checkbox
                id="free-entry-checkbox"
                flexGrow={0}
                fontWeight="normal"
                size="sm"
                spacing={1}
                defaultChecked={freeEntry}
                onChange={onFreeEntryChange}
                isInvalid={false}
              >
                Free entry
              </Checkbox>
            </>
          }
        />
        {!freeEntry && <BalancyCounterWithPopover ml="auto !important" pl="5" />}
      </Wrap>

      <LogicFormControl />

      {freeEntry ? (
        <CardMotionWrapper>
          <Card px="6" py="4">
            <FreeRequirement />
          </Card>
        </CardMotionWrapper>
      ) : (
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
            <AddRequirement onAdd={addRequirement} />
          </AnimatePresence>
        </Stack>
      )}

      {/* <FormErrorMessage id="requirements-error-message">
        {errors.requirements?.message as string}
      </FormErrorMessage> */}
    </Stack>
  )
}

export default SetRequirements
