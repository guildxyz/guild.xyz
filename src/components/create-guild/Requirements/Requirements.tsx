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
              {fields.map((field, i) => {
                const type: RequirementType = getValues(`requirements.${i}.type`)

                switch (type) {
                  case "ERC20":
                  case "COIN":
                    return (
                      <AnimatePresence key={field.id}>
                        <TokenFormCard
                          field={field as RequirementFormField}
                          index={i}
                          onRemove={() => remove(i)}
                        />
                      </AnimatePresence>
                    )
                  case "POAP":
                    return (
                      <AnimatePresence key={field.id}>
                        <PoapFormCard
                          field={field as RequirementFormField}
                          index={i}
                          onRemove={() => remove(i)}
                        />
                      </AnimatePresence>
                    )
                  case "MIRROR":
                    return (
                      <AnimatePresence key={field.id}>
                        <MirrorFormCard
                          field={field as RequirementFormField}
                          index={i}
                          onRemove={() => remove(i)}
                        />
                      </AnimatePresence>
                    )
                  case "SNAPSHOT":
                    return (
                      <AnimatePresence key={field.id}>
                        <SnapshotFormCard
                          field={field as RequirementFormField}
                          index={i}
                          onRemove={() => remove(i)}
                        />
                      </AnimatePresence>
                    )
                  case "WHITELIST":
                    return (
                      <AnimatePresence key={field.id}>
                        <WhitelistFormCard
                          field={field as RequirementFormField}
                          index={i}
                          onRemove={() => remove(i)}
                        />
                      </AnimatePresence>
                    )
                  case "ERC721":
                    return (
                      <AnimatePresence key={field.id}>
                        <NftFormCard
                          field={field as RequirementFormField}
                          index={i}
                          onRemove={() => remove(i)}
                        />
                      </AnimatePresence>
                    )
                  default:
                    return null
                }
              })}
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
