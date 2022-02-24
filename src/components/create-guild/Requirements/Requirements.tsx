import { Box, Checkbox, SimpleGrid, Text } from "@chakra-ui/react"
import { useRumAction } from "@datadog/rum-react-integration"
import Section from "components/common/Section"
import { AnimatePresence, AnimateSharedLayout } from "framer-motion"
import { useEffect, useState } from "react"
import { useFieldArray, useFormContext } from "react-hook-form"
import { RequirementFormField, RequirementType } from "types"
import AddRequirementCard from "./components/AddRequirementCard"
import FormCard from "./components/FormCard"
import JuiceboxFormCard from "./components/JuiceboxFormCard"
import MirrorFormCard from "./components/MirrorFormCard"
import NftFormCard from "./components/NftFormCard"
import PoapFormCard from "./components/PoapFormCard"
import SnapshotFormCard from "./components/SnapshotFormCard"
import TokenFormCard from "./components/TokenFormCard"
import UnlockFormCard from "./components/UnlockFormCard"
import WhitelistFormCard from "./components/WhitelistFormCard"

const REQUIREMENT_FORMCARDS = {
  ERC20: TokenFormCard,
  COIN: TokenFormCard,
  POAP: PoapFormCard,
  MIRROR: MirrorFormCard,
  SNAPSHOT: SnapshotFormCard,
  WHITELIST: WhitelistFormCard,
  ERC721: NftFormCard,
  CUSTOM_ID: NftFormCard,
  ERC1155: NftFormCard,
  JUICEBOX: JuiceboxFormCard,
  UNLOCK: UnlockFormCard,
}

type Props = {
  maxCols?: number
}

const Requirements = ({ maxCols = 2 }: Props): JSX.Element => {
  const addDatadogAction = useRumAction("trackingAppAction")
  const { control, getValues, setValue, watch, clearErrors } = useFormContext()

  /**
   * TODO: UseFieldArrays's remove function doesn't work correctly with
   * AnimatePresence for some reason, so as workaround we don't remove fields, just
   * set them to inactive and filter them out at submit
   */
  const { fields, append } = useFieldArray({
    name: "requirements",
    control,
  })

  const addRequirement = (type: RequirementType) => {
    append({
      active: true,
      type,
      address: null,
      key: null,
      value: type === "ERC20" || type === "JUICEBOX" ? 0 : null,
      interval: null,
      amount: null,
    })

    // Sending actions to datadog
    addDatadogAction("Added a requirement")
    addDatadogAction(`Added a requirement [${type}]`)
  }

  const removeRequirement = (index: number) => {
    setValue(`requirements.${index}.active`, false)
    clearErrors(`requirements.${index}`)
  }

  // Watching the nested fields too, so we can properly update the list if the `active` field changes on a FormCard
  const watchFieldArray = watch("requirements")
  const controlledFields = fields.map((field, index) => ({
    ...field,
    ...watchFieldArray[index],
  }))

  const [freeEntry, setFreeEntry] = useState(
    controlledFields?.find((requirement) => requirement.type === "FREE")
  )

  useEffect(() => {
    // Find the free requirement type, or add one
    const freeEntryRequirement = controlledFields?.find(
      (requirement) => requirement.type === "FREE"
    )
    const freeEntryRequirementIndex = controlledFields?.indexOf(freeEntryRequirement)

    if (!freeEntry && freeEntryRequirement) {
      setValue(`requirements.${freeEntryRequirementIndex}.active`, false)
      return
    }
    if (!freeEntry) return

    clearErrors("requirements")
    setValue(`requirements.${freeEntryRequirementIndex}.active`, true)
    if (!freeEntryRequirement) addRequirement("FREE")
  }, [freeEntry])

  return (
    <>
      <Section
        title="Set requirements"
        titleRightElement={
          <>
            <Text as="span" fontWeight="normal" fontSize="sm" color="gray">
              {`- or `}
            </Text>
            <Checkbox
              fontWeight="normal"
              size="sm"
              spacing={1}
              defaultChecked={controlledFields?.find(
                (requirement) => requirement.type === "FREE"
              )}
              onChange={(e) => setFreeEntry(e.target.checked)}
            >
              Free entry
            </Checkbox>
          </>
        }
      >
        <AnimateSharedLayout>
          <SimpleGrid
            position="relative"
            opacity={freeEntry ? 0.5 : 1}
            columns={{ base: 1, md: 2, lg: maxCols }}
            spacing={{ base: 5, md: 6 }}
          >
            <AnimatePresence>
              {controlledFields.map((field: RequirementFormField, i) => {
                const type: RequirementType = getValues(`requirements.${i}.type`)
                const RequirementFormCard = REQUIREMENT_FORMCARDS[type]

                if (field.active && RequirementFormCard) {
                  return (
                    <FormCard
                      type={type}
                      onRemove={() => removeRequirement(i)}
                      key={field.id}
                    >
                      <RequirementFormCard field={field} index={i} />
                    </FormCard>
                  )
                }
              })}
            </AnimatePresence>

            <AddRequirementCard
              initial={!controlledFields?.filter((field) => field.active).length}
              onAdd={addRequirement}
            />

            <Box
              display={freeEntry ? "block" : "none"}
              position="absolute"
              inset={0}
              bgColor="transparent"
            />
          </SimpleGrid>
        </AnimateSharedLayout>
      </Section>
    </>
  )
}

export default Requirements
