import { Checkbox, Text, useBreakpointValue } from "@chakra-ui/react"
import { useRumAction } from "@datadog/rum-react-integration"
import Card from "components/common/Card"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import Section from "components/common/Section"
import FreeRequirement from "components/[guild]/Requirements/components/FreeRequirement"
import { useEffect, useMemo } from "react"
import { useFieldArray, useFormContext, useWatch } from "react-hook-form"
import { Requirement, RequirementType } from "types"
import AddRequirement from "./components/AddRequirement"
import BalancyCounterWithPopover from "./components/BalancyCounter"
import LogicPicker from "./components/LogicPicker"
import RequirementEditableCard from "./components/RequirementEditableCard"
import useAddRequirementsFromQuery from "./hooks/useAddRequirementsFromQuery"

const SetRequirements = (): JSX.Element => {
  const addDatadogAction = useRumAction("trackingAppAction")
  const { control, getValues, watch, clearErrors } = useFormContext()

  const { fields, append, replace, remove, update } = useFieldArray({
    name: "requirements",
    control,
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

  const freeEntry = useMemo(
    () => !!controlledFields?.find((requirement) => requirement.type === "FREE"),
    [controlledFields]
  )

  const onFreeEntryChange = (e) =>
    e.target.checked
      ? replace([{ type: "FREE", data: {}, chain: null, address: null }])
      : replace([])

  const isMobile = useBreakpointValue({ base: true, sm: false })

  return (
    <Section
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
          {!freeEntry && !isMobile && (
            <BalancyCounterWithPopover ml="auto !important" />
          )}
        </>
      }
      spacing={0}
    >
      {!freeEntry && isMobile && <BalancyCounterWithPopover mb="6" />}
      {controlledFields.map((field: Requirement, i) => {
        const type: RequirementType = getValues(`requirements.${i}.type`)

        if (type === "FREE")
          return (
            <CardMotionWrapper>
              <Card px="6" py="4">
                <FreeRequirement />
              </Card>
            </CardMotionWrapper>
          )

        return (
          <CardMotionWrapper key={field.id}>
            <RequirementEditableCard
              type={type}
              field={field}
              index={i}
              removeRequirement={remove}
              updateRequirement={update}
            />
            <LogicPicker />
          </CardMotionWrapper>
        )
      })}

      {!freeEntry && <AddRequirement onAdd={addRequirement} />}

      {/* <FormErrorMessage id="requirements-error-message">
        {errors.requirements?.message as string}
      </FormErrorMessage> */}
    </Section>
  )
}

export default SetRequirements
