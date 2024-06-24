import { ChakraProps, Collapse, Stack, Wrap } from "@chakra-ui/react"
import { Schemas } from "@guildxyz/types"
import LogicDivider from "components/[guild]/LogicDivider"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import { SectionTitle } from "components/common/Section"
import { AnimatePresence } from "framer-motion"
import useToast from "hooks/useToast"
import { useFormContext, useWatch } from "react-hook-form"
import { RequirementType } from "requirements"
import FreeRequirement from "requirements/Free/FreeRequirement"
import { Requirement, RolePlatform } from "types"
import AddRequirement from "./components/AddRequirement"
import BalancyCounterWithPopover from "./components/BalancyCounter"
import LogicFormControl from "./components/LogicFormControl"
import RequirementBaseCard from "./components/RequirementBaseCard"
import RequirementEditableCard from "./components/RequirementEditableCard"
import useHandleRequirementState from "./hooks/useHandleRequirementState"

type Props = {
  titleSize?: ChakraProps["fontSize"]
}

const SetRequirements = ({ titleSize = undefined }: Props): JSX.Element => {
  const methods = useFormContext<Schemas["RoleCreationPayload"]>()
  const { getValues } = methods
  const logic = useWatch({ name: "logic" })
  const { requirements, append, remove, update, freeEntry } =
    useHandleRequirementState(methods)

  const rolePlatforms: RolePlatform[] = useWatch({ name: "rolePlatforms" })

  const toast = useToast()

  const isProviderReq = (req: Requirement) =>
    rolePlatforms.some((rp) => {
      if (!rp.dynamicAmount) return false

      const input: any = rp.dynamicAmount.operation.input
      return input.requirementId === req.id
    })

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
            requirements.map((req, i) => {
              const type = getValues(`requirements.${i}.type`)

              return (
                <CardMotionWrapper key={req.id}>
                  <RequirementEditableCard
                    // TODO: remove these type conversions once we use Zod schemas everywhere
                    type={type as unknown as RequirementType}
                    field={req as unknown as Requirement}
                    index={i}
                    removeRequirement={(idx) => {
                      if (isProviderReq(req)) {
                        toast({
                          status: "info",
                          title:
                            "The requirement is necessary for dynamic token rewards, therefore cannot be removed.",
                        })
                        return
                      }
                      remove(idx)
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
