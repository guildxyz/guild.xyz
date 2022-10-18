import {
  Box,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  SimpleGrid,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react"
import { useRumAction } from "@datadog/rum-react-integration"
import { useEffect, useMemo } from "react"
import {
  useFieldArray,
  useFormContext,
  useFormState,
  useWatch,
} from "react-hook-form"
import { Requirement, RequirementType } from "types"
import LogicPicker from "../LogicPicker"
import AddRequirementCard from "./components/AddRequirementCard"
import AllowlistFormCard from "./components/AllowlistFormCard"
import BalancyCounter from "./components/BalancyCounter"
import ContractStateFormCard from "./components/ContractStateFormCard/ContractStateFormCard"
import DiscoFormCard from "./components/DiscoFormCard"
import DiscordFormCard from "./components/DiscordFormCard"
import FormCard from "./components/FormCard"
import GalaxyFormCard from "./components/GalaxyFormCard"
import GithubFormCard from "./components/GithubFormCard"
import GitPoapFormCard from "./components/GitPoapFormCard"
import JuiceboxFormCard from "./components/JuiceboxFormCard"
import LensFormCard from "./components/LensFormCard"
import MirrorFormCard from "./components/MirrorFormCard"
import NftFormCard from "./components/NftFormCard"
import NooxFormCard from "./components/NooxFormCard"
import OtterspaceFormCard from "./components/OtterspaceFormCard"
import PoapFormCard from "./components/PoapFormCard"
import SnapshotFormCard from "./components/SnapshotFormCard"
import TokenFormCard from "./components/TokenFormCard"
import TwitterFormCard from "./components/TwitterFormCard"
import UnlockFormCard from "./components/UnlockFormCard"
import useAddRequirementsFromQuery from "./hooks/useAddRequirementsFromQuery"

const REQUIREMENT_FORMCARDS = {
  ERC20: TokenFormCard,
  COIN: TokenFormCard,
  CONTRACT: ContractStateFormCard,
  POAP: PoapFormCard,
  GITPOAP: GitPoapFormCard,
  MIRROR: MirrorFormCard,
  SNAPSHOT: SnapshotFormCard,
  ALLOWLIST: AllowlistFormCard,
  ERC721: NftFormCard,
  ERC1155: NftFormCard,
  NOUNS: NftFormCard,
  JUICEBOX: JuiceboxFormCard,
  UNLOCK: UnlockFormCard,
  GALAXY: GalaxyFormCard,
  TWITTER: TwitterFormCard,
  TWITTER_FOLLOW: TwitterFormCard,
  TWITTER_NAME: TwitterFormCard,
  TWITTER_FOLLOWER_COUNT: TwitterFormCard,
  TWITTER_BIO: TwitterFormCard,
  GITHUB: GithubFormCard,
  GITHUB_STARRING: GithubFormCard,
  DISCORD: DiscordFormCard,
  DISCORD_ROLE: DiscordFormCard,
  NOOX: NooxFormCard,
  DISCO: DiscoFormCard,
  LENS_PROFILE: LensFormCard,
  LENS_FOLLOW: LensFormCard,
  LENS_COLLECT: LensFormCard,
  LENS_MIRROR: LensFormCard,
  OTTERSPACE: OtterspaceFormCard,
}

type Props = {
  maxCols?: number
}

const SetRequirements = ({ maxCols = 2 }: Props): JSX.Element => {
  const addDatadogAction = useRumAction("trackingAppAction")
  const { control, getValues, setValue, watch, clearErrors } = useFormContext()

  const { errors } = useFormState()

  /**
   * TODO: UseFieldArrays's remove function doesn't work correctly with
   * AnimatePresence for some reason, so as workaround we don't remove fields, just
   * set their type to `null` and filter them out at submit
   */
  const { fields, append, replace } = useFieldArray({
    name: "requirements",
    control,
  })

  const requirements = useWatch({ name: "requirements" })

  useEffect(() => {
    if (
      !requirements ||
      requirements?.length === 0 ||
      requirements?.every(({ type }) => !type)
    ) {
      // setError("requirements", {
      //   message: "Set some requirements, or make the role free",
      // })
    } else {
      clearErrors("requirements")
    }
  }, [requirements])

  useAddRequirementsFromQuery(append)

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

  const freeEntry = useMemo(
    () => !!controlledFields?.find((requirement) => requirement.type === "FREE"),
    [controlledFields]
  )

  const onFreeEntryChange = (e) =>
    e.target.checked
      ? replace([{ type: "FREE", data: {}, chain: null, address: null }])
      : replace([])

  const isMobile = useBreakpointValue({ base: true, sm: false })

  return (
    <>
      <LogicPicker />
      <FormControl isInvalid={!!errors.requirements?.message}>
        <HStack mb={2}>
          <FormLabel m="0" htmlFor="-">
            Requirements
          </FormLabel>
          <Text as="span" fontWeight="normal" fontSize="sm" color="gray">
            {`- or `}
          </Text>
          <Checkbox
            id="free-entry-checkbox"
            flexGrow={0}
            fontWeight="normal"
            size="sm"
            spacing={1}
            defaultChecked={freeEntry}
            onChange={onFreeEntryChange}
            isInvalid={false}
          >
            Free entry
          </Checkbox>
          {!freeEntry && !isMobile && <BalancyCounter ml="auto !important" />}
        </HStack>

        {!freeEntry && isMobile && <BalancyCounter />}
        <SimpleGrid
          position="relative"
          opacity={freeEntry ? 0.5 : 1}
          columns={{ base: 1, md: 2, lg: maxCols }}
          spacing={{ base: 5, md: 6 }}
          pb="20"
        >
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

        <FormErrorMessage id="requirements-error-message">
          {errors.requirements?.message as string}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}

export default SetRequirements
