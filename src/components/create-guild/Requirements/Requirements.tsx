import { SimpleGrid } from "@chakra-ui/react"
import AddCard from "components/common/AddCard"
import Section from "components/common/Section"
import { AnimatePresence, AnimateSharedLayout } from "framer-motion"
import { useFieldArray, useFormContext } from "react-hook-form"
import { RequirementFormField, RequirementType } from "types"
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
  JUICEBOX: JuiceboxFormCard,
  UNLOCK: UnlockFormCard,
}

type Props = {
  maxCols?: number
}

const Requirements = ({ maxCols = 3 }: Props): JSX.Element => {
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

  return (
    <>
      {controlledFields?.length > 0 && (
        <Section title="Set requirements">
          <AnimateSharedLayout>
            <SimpleGrid
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
            </SimpleGrid>
          </AnimateSharedLayout>
        </Section>
      )}

      <Section title={controlledFields.length ? "Add more" : "Set requirements"}>
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: maxCols }}
          spacing={{ base: 5, md: 6 }}
        >
          <AddCard text="Hold an NFT" onClick={() => addRequirement("ERC721")} />
          <AddCard text="Hold a Token" onClick={() => addRequirement("ERC20")} />
          <AddCard text="Hold a POAP" onClick={() => addRequirement("POAP")} />
          <AddCard
            text="Snapshot strategy"
            onClick={() => addRequirement("SNAPSHOT")}
          />
          <AddCard text="Whitelist" onClick={() => addRequirement("WHITELIST")} />
          <AddCard text="Mirror edition" onClick={() => addRequirement("MIRROR")} />
          <AddCard text="Unlock" onClick={() => addRequirement("UNLOCK")} />
          <AddCard
            text="Juicebox project"
            onClick={() => addRequirement("JUICEBOX")}
          />
        </SimpleGrid>
      </Section>
    </>
  )
}

export default Requirements
