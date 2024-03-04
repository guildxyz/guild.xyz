import { Stack } from "@chakra-ui/react"
import LogicDivider from "components/[guild]/LogicDivider"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import { SectionTitle } from "components/common/Section"
import { AnimatePresence } from "framer-motion"
import { useWatch } from "react-hook-form"
import FreeRequirement from "requirements/Free/FreeRequirement"
import { Requirement } from "types"
import AddRequirement from "./components/AddRequirement"
import ExistingRequirementEditableCard from "./components/ExistingRequirementEditableCard"
import LogicFormControl from "./components/LogicFormControl"
import RequirementBaseCard from "./components/RequirementBaseCard"

type Props = { requirements: Requirement[] }

const EditRequirements = ({ requirements }: Props) => {
  const logic = useWatch({ name: "logic" })
  const freeEntry = requirements.some(({ type }) => type === "FREE")

  return (
    <Stack spacing="5" w="full">
      <SectionTitle title="Requirements" />

      {!freeEntry && (
        <CardMotionWrapper>
          <LogicFormControl />
        </CardMotionWrapper>
      )}

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
            requirements.map((requirement) => (
              <CardMotionWrapper key={requirement.id}>
                <ExistingRequirementEditableCard
                  requirement={requirement}
                  isEditDisabled={requirement.type === "PAYMENT"}
                />
                <LogicDivider logic={logic ?? "AND"} />
              </CardMotionWrapper>
            ))
          )}
          <AddRequirement />
        </AnimatePresence>
      </Stack>
    </Stack>
  )
}

export default EditRequirements
