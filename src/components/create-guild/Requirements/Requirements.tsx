import { SimpleGrid } from "@chakra-ui/react"
import AddCard from "components/common/AddCard"
import Section from "components/common/Section"
import { useFieldArray, useFormContext } from "react-hook-form"
import { RequirementType } from "temporaryData/types"
import NftFormCard from "./components/NftFormCard"
import PoapFormCard from "./components/PoapFormCard"
import SnapshotFormCard from "./components/SnapshotFormCard"
import TokenFormCard from "./components/TokenFormCard"
import WhitelistFormCard from "./components/WhitelistFormCard"

const Requirements = (): JSX.Element => {
  const { control, getValues } = useFormContext()

  const {
    fields: requirementFields,
    append: appendRequirement,
    remove: removeRequirement,
  } = useFieldArray({
    control,
    name: "requirements",
  })

  const addRequirement = (type: RequirementType) => {
    // Rendering the cards by "initialType", but the "type" field is editable inside some formcards (like in NftFormCard)
    appendRequirement({ initialType: type, type })
  }

  return (
    <>
      {requirementFields?.length > 0 && (
        <Section
          title="Set requirements"
          description="Set up one or more requirements for your guild"
        >
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3 }}
            spacing={{ base: 5, md: 6 }}
          >
            {requirementFields.map((requirementForm, i) => {
              // initialType is used on the create guild page, type is used on the edit page
              const initialType: RequirementType = getValues(
                `requirements.${i}.initialType`
              )
              const type: RequirementType = getValues(`requirements.${i}.type`)

              switch (initialType || type) {
                case "ERC20":
                case "ETHER":
                  return (
                    <TokenFormCard
                      key={requirementForm.id}
                      index={i}
                      onRemove={() => removeRequirement(i)}
                    />
                  )
                case "POAP":
                  return (
                    <PoapFormCard
                      key={requirementForm.id}
                      index={i}
                      onRemove={() => removeRequirement(i)}
                    />
                  )
                case "SNAPSHOT":
                  return (
                    <SnapshotFormCard
                      key={requirementForm.id}
                      index={i}
                      onRemove={() => removeRequirement(i)}
                    />
                  )
                case "WHITELIST":
                  return (
                    <WhitelistFormCard
                      key={requirementForm.id}
                      index={i}
                      onRemove={() => removeRequirement(i)}
                    />
                  )
                default:
                  return (
                    <NftFormCard
                      key={requirementForm.id}
                      index={i}
                      onRemove={() => removeRequirement(i)}
                    />
                  )
              }
            })}
          </SimpleGrid>
        </Section>
      )}

      <Section
        title={requirementFields.length ? "Add more" : "Set requirements"}
        description={
          !requirementFields.length &&
          "Set up one or more requirements for your guild"
        }
      >
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 5, md: 6 }}>
          <AddCard text="Hold an NFT" onClick={() => addRequirement("ERC721")} />
          <AddCard text="Hold a Token" onClick={() => addRequirement("ERC20")} />
          <AddCard text="Hold a POAP" onClick={() => addRequirement("POAP")} />
          <AddCard
            text="Snapshot strategy"
            onClick={() => addRequirement("SNAPSHOT")}
          />
          <AddCard text="Whitelist" onClick={() => addRequirement("WHITELIST")} />
        </SimpleGrid>
      </Section>
    </>
  )
}

export default Requirements
