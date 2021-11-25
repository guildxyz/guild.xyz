import { SimpleGrid } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import AddCard from "components/common/AddCard"
import Section from "components/common/Section"
import { Chains } from "connectors"
import { AnimatePresence, AnimateSharedLayout } from "framer-motion"
import { useEffect } from "react"
import { useFieldArray, useFormContext } from "react-hook-form"
import { RequirementType } from "temporaryData/types"
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
      value: null,
    })
  }

  // DEBUG
  useEffect(() => {
    console.log(fields)
  }, [fields])

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
                {fields.map((field, i) => {
                  const type: RequirementType = getValues(`requirements.${i}.type`)

                  switch (type) {
                    case "ERC20":
                    case "COIN":
                      return (
                        <TokenFormCard
                          key={field.id}
                          index={i}
                          onRemove={() => remove(i)}
                        />
                      )
                    case "POAP":
                      return (
                        <PoapFormCard
                          key={field.id}
                          index={i}
                          onRemove={() => remove(i)}
                        />
                      )
                    case "MIRROR":
                      return (
                        <MirrorFormCard
                          key={field.id}
                          index={i}
                          onRemove={() => remove(i)}
                        />
                      )
                    case "SNAPSHOT":
                      return (
                        <SnapshotFormCard
                          key={field.id}
                          index={i}
                          onRemove={() => remove(i)}
                        />
                      )
                    case "WHITELIST":
                      return (
                        <WhitelistFormCard
                          key={field.id}
                          index={i}
                          onRemove={() => remove(i)}
                        />
                      )
                    case "ERC721":
                      return (
                        <NftFormCard
                          key={field.id}
                          index={i}
                          onRemove={() => remove(i)}
                        />
                      )
                    default:
                      return null
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
          <AddCard
            text="Snapshot strategy"
            onClick={() => addRequirement("SNAPSHOT")}
          />
          <AddCard text="Whitelist" onClick={() => addRequirement("WHITELIST")} />
          <AddCard text="Mirror edition" onClick={() => addRequirement("MIRROR")} />
        </SimpleGrid>
      </Section>
    </>
  )
}

export default Requirements
