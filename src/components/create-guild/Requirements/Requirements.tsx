import {
  Box,
  Checkbox,
  HStack,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  SimpleGrid,
  Spinner,
  Text,
  Tooltip,
} from "@chakra-ui/react"
import { useRumAction } from "@datadog/rum-react-integration"
import Link from "components/common/Link"
import Section from "components/common/Section"
import { AnimatePresence, AnimateSharedLayout } from "framer-motion"
import { Question, Warning } from "phosphor-react"
import { useEffect, useState } from "react"
import { useFieldArray, useFormContext } from "react-hook-form"
import { GuildFormType, Requirement, RequirementType } from "types"
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
import useBalancy from "./hooks/useBalancy"

const REQUIREMENT_FORMCARDS = {
  ERC20: TokenFormCard,
  COIN: TokenFormCard,
  POAP: PoapFormCard,
  MIRROR: MirrorFormCard,
  SNAPSHOT: SnapshotFormCard,
  WHITELIST: WhitelistFormCard,
  ERC721: NftFormCard,
  ERC1155: NftFormCard,
  JUICEBOX: JuiceboxFormCard,
  UNLOCK: UnlockFormCard,
}

type Props = {
  maxCols?: number
}

const Requirements = ({ maxCols = 2 }: Props): JSX.Element => {
  const addDatadogAction = useRumAction("trackingAppAction")
  const { control, getValues, setValue, watch, clearErrors } =
    useFormContext<GuildFormType>()

  /**
   * TODO: UseFieldArrays's remove function doesn't work correctly with
   * AnimatePresence for some reason, so as workaround we don't remove fields, just
   * set their type to `null` and filter them out at submit
   */
  const { fields, append } = useFieldArray({
    name: "requirements",
    control,
  })

  const addRequirement = (type: RequirementType) => {
    append({
      type,
      address: null,
      data: {},
    })

    // Sending actions to datadog
    addDatadogAction("Added a requirement")
    addDatadogAction(`Added a requirement [${type}]`)
  }

  const removeRequirement = (index: number) => {
    setValue(`requirements.${index}.type`, null)
    clearErrors(`requirements.${index}`)
  }

  // Watching the nested fields too, so we can properly update the list
  const watchFieldArray = watch("requirements")
  const controlledFields = fields.map((field, index) => ({
    ...field,
    ...watchFieldArray[index],
  }))

  const [freeEntry, setFreeEntry] = useState(
    !!controlledFields?.find((requirement) => requirement.type === "FREE")
  )

  useEffect(() => {
    // Find the free requirement type, or add one
    const freeEntryRequirement = controlledFields?.find(
      (requirement) => requirement.type === "FREE"
    )
    const freeEntryRequirementIndex = controlledFields?.indexOf(freeEntryRequirement)

    if (!freeEntry && freeEntryRequirement) {
      setValue(`requirements.${freeEntryRequirementIndex}.type`, null)
      return
    }
    if (!freeEntry) return

    clearErrors("requirements")

    if (freeEntryRequirementIndex < 0) addRequirement("FREE")
  }, [freeEntry])

  const { holders, isLoading, unsupportedTypes, isInaccurate, unsupportedChains } =
    useBalancy()

  return (
    <>
      <Section
        title="Set requirements"
        titleRightElement={
          <HStack flexGrow={1} justifyContent="space-between" alignItems="cemnter">
            <HStack spacing={2}>
              <Text as="span" fontWeight="normal" fontSize="sm" color="gray">
                {`- or `}
              </Text>
              <Checkbox
                fontWeight="normal"
                size="sm"
                spacing={1}
                defaultChecked={
                  !!controlledFields?.find(
                    (requirement) => requirement.type === "FREE"
                  )
                }
                onChange={(e) => setFreeEntry(e.target.checked)}
              >
                Free entry
              </Checkbox>
            </HStack>

            <HStack spacing={4}>
              {isLoading && <Spinner size="sm" color="gray" />}

              {typeof holders === "number" && (
                <HStack>
                  {" "}
                  {isInaccurate && (
                    <Tooltip
                      label={`Calculations may be inaccurate. We couldn't calculate eligible addresses for ${
                        unsupportedTypes.length > 0
                          ? `${
                              unsupportedTypes.length > 1
                                ? "these requitement types"
                                : "this requirement type"
                            }: ${unsupportedTypes.join(", ")}${
                              unsupportedChains.length > 0 ? ", and " : ""
                            }`
                          : ""
                      }${
                        unsupportedChains.length > 0
                          ? `${
                              unsupportedChains.length > 1
                                ? "these chains"
                                : "this chain"
                            }: ${unsupportedChains.join(", ")}`
                          : ""
                      }.`}
                    >
                      <Warning color="gray" />
                    </Tooltip>
                  )}
                  <Text size="sm" color="gray" fontWeight="semibold">
                    {isInaccurate ? "<" : ""} {holders} eligible addresses
                  </Text>
                  <Popover trigger="hover" openDelay={0}>
                    <PopoverTrigger>
                      <Question color="gray" />
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverArrow />
                      <PopoverBody>
                        <Text>
                          Number of addresses meeting the requirements for your
                          guild.
                        </Text>
                        <Text>
                          Powered by{" "}
                          <Link
                            href="https://twitter.com/balancy_io"
                            target="_blank"
                            fontWeight="semibold"
                            colorScheme="twitter"
                          >
                            <a>Balancy</a>
                          </Link>
                        </Text>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                </HStack>
              )}
            </HStack>
          </HStack>
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
              {controlledFields.map((field: Requirement, i) => {
                const type: RequirementType = getValues(`requirements.${i}.type`)
                const RequirementFormCard = REQUIREMENT_FORMCARDS[type]

                if (RequirementFormCard) {
                  return (
                    <FormCard
                      index={i}
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
              initial={!controlledFields?.find((field) => !!field.type)}
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
