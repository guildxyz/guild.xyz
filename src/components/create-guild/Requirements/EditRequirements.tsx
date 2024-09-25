import { useDisclosure } from "@/hooks/useDisclosure"
import { Button, Collapse, HStack, Stack } from "@chakra-ui/react"
import { ListNumbers } from "@phosphor-icons/react"
import LogicDivider from "components/[guild]/LogicDivider"
import useRequirements from "components/[guild]/hooks/useRequirements"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import { SectionTitle } from "components/common/Section"
import { AnimatePresence } from "framer-motion"
import { useRef } from "react"
import { useWatch } from "react-hook-form"
import FreeRequirement from "requirements/Free/FreeRequirement"
import mapRequirement from "utils/mapRequirement"
import AddRequirement from "./components/AddRequirement"
import ExistingRequirementEditableCard from "./components/ExistingRequirementEditableCard"
import LogicFormControl from "./components/LogicFormControl"
import OrderRequirementsModal from "./components/OrderRequirementsModal"
import RequirementBaseCard from "./components/RequirementBaseCard"

type Props = { roleId: number }

const EditRequirements = ({ roleId }: Props) => {
  const { data: requirements } = useRequirements(roleId)
  const logic = useWatch({ name: "logic" })
  const freeEntry = requirements.some(({ type }) => type === "FREE")

  const mappedRequirements = requirements?.map(mapRequirement)

  const {
    isOpen: isOrderModalOpen,
    onOpen: onOrderModalOpen,
    onClose: onOrderModalClose,
  } = useDisclosure()
  const orderButtonRef = useRef(null)

  return (
    <>
      <Stack spacing="5" w="full">
        <HStack justifyContent="space-between">
          <SectionTitle title="Requirements" />
          <Button
            size={"sm"}
            ref={orderButtonRef}
            onClick={onOrderModalOpen}
            leftIcon={<ListNumbers />}
            variant={"ghost"}
          >
            Reorder requirements
          </Button>
        </HStack>

        {/* negative margin with padding so LogicFormControl's input focus states doesn't get cut off */}
        <Collapse in={!freeEntry} style={{ margin: "-2px", padding: "2px" }}>
          <LogicFormControl requirements={mappedRequirements} />
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
              mappedRequirements.map((requirement) => (
                <CardMotionWrapper key={requirement.id}>
                  <ExistingRequirementEditableCard
                    requirement={requirement}
                    isEditDisabled={
                      requirement.type === "PAYMENT" ||
                      requirement.type === "GUILD_SNAPSHOT"
                    }
                  />
                  <LogicDivider logic={logic ?? "AND"} />
                </CardMotionWrapper>
              ))
            )}
            <AddRequirement />
          </AnimatePresence>
        </Stack>
      </Stack>
      <OrderRequirementsModal
        roleId={roleId}
        requirements={mappedRequirements}
        isOpen={isOrderModalOpen}
        onClose={onOrderModalClose}
        finalFocusRef={orderButtonRef}
      />
    </>
  )
}

export default EditRequirements
