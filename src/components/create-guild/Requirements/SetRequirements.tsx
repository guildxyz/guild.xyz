import { ChakraProps, Collapse, Stack, Wrap } from "@chakra-ui/react"
import LogicDivider from "components/[guild]/LogicDivider"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import { SectionTitle } from "components/common/Section"
import { AnimatePresence } from "framer-motion"
import { useFieldArray, useFormContext, useWatch } from "react-hook-form"
import { RequirementType } from "requirements"
import FreeRequirement from "requirements/Free/FreeRequirement"
import { GuildFormType, Requirement } from "types"
import AddRequirement from "./components/AddRequirement"
import BalancyCounterWithPopover from "./components/BalancyCounter"
import LogicFormControl from "./components/LogicFormControl"
import RequirementBaseCard from "./components/RequirementBaseCard"
import RequirementEditableCard from "./components/RequirementEditableCard"

type Props = {
  titleSize?: ChakraProps["fontSize"]
}

const SetRequirements = ({ titleSize = undefined }: Props): JSX.Element => {
  const { getValues, watch, setValue } =
    useFormContext<GuildFormType["roles"][number]>()

  const logic = useWatch({ name: "logic" })

  const {
    fields,
    append: appendToFieldArray,
    update,
    remove,
  } = useFieldArray({
    name: "requirements",
    keyName: "formFieldId",
  })

  // Watching the nested fields too, so we can properly update the list
  const watchFieldArray = watch("requirements")
  const controlledFields = fields.map((field, index) => ({
    ...field,
    ...watchFieldArray?.[index],
  }))
  const freeEntry = !!getValues("requirements")?.some(({ type }) => type === "FREE")

  const removeReq = (index: number) => {
    if (controlledFields.length === 1) {
      setValue("requirements", [{ type: "FREE" }])
    } else {
      remove(index)
    }
  }

  const append = (req: Requirement) => {
    if (freeEntry) {
      setValue("requirements", [req])
    } else {
      appendToFieldArray(req)
    }
  }

  return (
    <Stack spacing="5" w="full">
      <Wrap spacing="3">
        <SectionTitle
          title="Requirements"
          {...(titleSize && { fontSize: titleSize })}
        />
        {!freeEntry && <BalancyCounterWithPopover ml="auto !important" pl="5" />}
      </Wrap>

      <Collapse in={!freeEntry}>
        <LogicFormControl />
      </Collapse>

      <Stack spacing={0}>
        <AnimatePresence>
          {freeEntry ? (
            <CardMotionWrapper key="free-entry">
              <RequirementBaseCard>
                <FreeRequirement />
              </RequirementBaseCard>
              <LogicDivider logic="OR" />
            </CardMotionWrapper>
          ) : (
            controlledFields.map((field, i) => {
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
                  <LogicDivider logic={logic ?? "AND"} />
                </CardMotionWrapper>
              )
            })
          )}

          <AddRequirement onAdd={append} />
        </AnimatePresence>
        C
      </Stack>
    </Stack>
  )
}

export default SetRequirements
