import { ChakraProps, Collapse, Stack, Wrap } from "@chakra-ui/react"
import LogicDivider from "components/[guild]/LogicDivider"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import { SectionTitle } from "components/common/Section"
import { AnimatePresence } from "framer-motion"
import useToast from "hooks/useToast"
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
  const { getValues, watch } = useFormContext<GuildFormType["roles"][number]>()

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
      remove(0)
      appendToFieldArray({ type: "FREE" })
    } else {
      remove(index)
    }
  }

  const append = (req: Requirement) => {
    if (freeEntry) {
      remove(0)
    }

    appendToFieldArray(req)
  }

  const toast = useToast()

  return (
    <Stack spacing="5" w="full">
      <Wrap spacing="3">
        <SectionTitle
          title="Requirements"
          {...(titleSize && { fontSize: titleSize })}
        />
        {!freeEntry && <BalancyCounterWithPopover ml="auto !important" pl="5" />}
      </Wrap>

      {/* negative margin with padding so LogicFormControl's input focus states doesn't get cut off */}
      <Collapse in={!freeEntry} style={{ margin: "-2px", padding: "2px" }}>
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
                    field={field as Requirement}
                    index={i}
                    removeRequirement={(idx) => {
                      /**
                       * TODO: check if the role has an ERC20 reward & only show this
                       * toast in that case.
                       *
                       * We decided to leave it as is for now, because we can only
                       * add this requirement type for ERC20 requirements.
                       */
                      if (type === "GUILD_SNAPSHOT") {
                        toast({
                          status: "info",
                          title:
                            "The snapshot requirement is necessary for dynamic token rewards, therefore cannot be removed.",
                        })
                        return
                      }
                      removeReq(idx)
                    }}
                    updateRequirement={update}
                    isEditDisabled={type === "PAYMENT" || type === "GUILD_SNAPSHOT"}
                  />
                  <LogicDivider logic={logic ?? "AND"} />
                </CardMotionWrapper>
              )
            })
          )}

          <AddRequirement onAdd={append} />
        </AnimatePresence>
      </Stack>
    </Stack>
  )
}

export default SetRequirements
