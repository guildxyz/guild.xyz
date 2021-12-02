import { Box, SimpleGrid, Tooltip } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import AddCard from "components/common/AddCard"
import Section from "components/common/Section"
import { Chains } from "connectors"
import { AnimatePresence, AnimateSharedLayout } from "framer-motion"
import { useFieldArray, useFormContext } from "react-hook-form"
import { RequirementFormField, RequirementType } from "temporaryData/types"
import MirrorFormCard from "./components/MirrorFormCard"
import NftFormCard from "./components/NftFormCard"
import PoapFormCard from "./components/PoapFormCard"
import SnapshotFormCard from "./components/SnapshotFormCard"
import TokenFormCard from "./components/TokenFormCard"
import WhitelistFormCard from "./components/WhitelistFormCard"

const REQUIREMENT_FORMCARDS = {
  ERC20: TokenFormCard,
  COIN: TokenFormCard,
  POAP: PoapFormCard,
  MIRROR: MirrorFormCard,
  SNAPSHOT: SnapshotFormCard,
  WHITELIST: WhitelistFormCard,
  ERC721: NftFormCard,
}

const Requirements = (): JSX.Element => {
  const { chainId } = useWeb3React()
  const { control, getValues } = useFormContext()

  const { fields, append, remove } = useFieldArray({
    name: "requirements",
    control,
  })

  const addRequirement = (type: RequirementType) => {
    append({
      type,
      chain: chainId ? Chains[chainId] : "ETHEREUM",
      address: null,
      key: null,
      value: type === "ERC20" ? 0 : null,
      interval: null,
    })
  }

  return (
    <>
      {fields?.length > 0 && (
        <Section title="Set requirements">
          <AnimateSharedLayout>
            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 3 }}
              spacing={{ base: 5, md: 6 }}
            >
              <AnimatePresence>
                {fields.map((field) => {
                  const i = fields.map((f) => f.id).indexOf(field.id)
                  const type: RequirementType = getValues(`requirements.${i}.type`)
                  const RequirementFormCard = REQUIREMENT_FORMCARDS[type]

                  if (RequirementFormCard) {
                    return (
                      <RequirementFormCard
                        key={field.id}
                        field={field as RequirementFormField}
                        index={i}
                        onRemove={() => remove(i)}
                      />
                    )
                  }
                })}
              </AnimatePresence>
            </SimpleGrid>
          </AnimateSharedLayout>
        </Section>
      )}

      <Section title={fields.length ? "Add more" : "Set requirements"}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 5, md: 6 }}>
          <AddCard text="Hold an NFT" onClick={() => addRequirement("ERC721")} />
          <AddCard text="Hold a Token" onClick={() => addRequirement("ERC20")} />
          <AddCard text="Hold a POAP" onClick={() => addRequirement("POAP")} />
          <Tooltip label="Sorry, we're experiencing some issues with Snapshot Strategies currently. Please check back later!">
            <Box>
              <AddCard
                text="Snapshot strategy"
                // onClick={() => addRequirement("SNAPSHOT")}
              />
            </Box>
          </Tooltip>
          <AddCard text="Whitelist" onClick={() => addRequirement("WHITELIST")} />
          <AddCard text="Mirror edition" onClick={() => addRequirement("MIRROR")} />
        </SimpleGrid>
      </Section>
    </>
  )
}

export default Requirements
