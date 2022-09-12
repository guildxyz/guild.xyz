import {
  FormControl,
  FormHelperText,
  FormLabel,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import StyledSelect from "components/common/StyledSelect"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import useGuild from "components/[guild]/hooks/useGuild"
import usePoap from "components/[guild]/Requirements/components/PoapRequirementCard/hooks/usePoap"
import { useMemo, useState } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { GuildFormType, Requirement, SelectOption } from "types"
import ChainInfo from "../ChainInfo"
import useGuildsPoaps from "./hooks/useGuildsPoaps"
import usePoapById from "./hooks/usePoapById"
import usePoaps from "./hooks/usePoaps"

type Props = {
  index: number
  field: Requirement
}

const FANCY_ID_REGEX = /^[0-9]*$/i

const customFilterOption = (candidate, input) =>
  candidate.label.toLowerCase().includes(input?.toLowerCase()) ||
  candidate.data?.details?.includes(input)

const PoapFormCard = ({ index, field }: Props): JSX.Element => {
  const {
    control,
    formState: { errors },
  } = useFormContext<GuildFormType>()

  const type = useWatch({ name: `requirements.${index}.type` })

  const dataId = useWatch({ name: `requirements.${index}.data.id`, control })
  const { poap: poapDetails } = usePoap(dataId)

  const { poaps: guildsPoapsList } = useGuild()
  const { guildsPoaps, isGuildsPoapsLoading } = useGuildsPoaps(
    guildsPoapsList?.map((p) => p.fancyId)
  )

  const { isLoading: isPoapsLoading, poaps } = usePoaps()

  const [pastedId, setPastedId] = useState(null)
  const { isPoapByIdLoading, poap } = usePoapById(pastedId)

  const isLoading = useMemo(
    () => isGuildsPoapsLoading || isPoapsLoading || isPoapByIdLoading,
    [isGuildsPoapsLoading, isPoapsLoading, isPoapByIdLoading]
  )

  const mappedPoaps = useMemo(() => {
    if (isLoading) return []

    let options = []

    const mappedGuildsPoaps =
      guildsPoaps?.map((p) => ({
        img: p.image_url,
        label: p.name,
        value: p.fancy_id,
        details: `#${p.id}`,
      })) ?? []

    if (mappedGuildsPoaps?.length) {
      options = options.concat(mappedGuildsPoaps)
    }

    let poapsList = []

    if (
      poapDetails &&
      !mappedGuildsPoaps?.find((p) => p.value === poapDetails.fancy_id)
    )
      poapsList.push({
        img: poapDetails.image_url,
        label: poapDetails.name,
        value: poapDetails.fancy_id,
        details: `#${poapDetails.id}`,
      })

    if (poap && !mappedGuildsPoaps?.find((p) => p.value === poap.fancy_id))
      poapsList.push({
        img: poap.image_url,
        label: poap.name,
        value: poap.fancy_id,
        details: `#${poap.id}`,
      })

    const guildsPoapsFancyIds = guildsPoaps?.map((p) => p.fancy_id) ?? []

    poapsList = poapsList.concat(
      poaps?.map((p) => {
        if (guildsPoapsFancyIds.includes(p.fancy_id)) return null
        return {
          img: p.image_url,
          label: p.name,
          value: p.fancy_id,
          details: `#${p.id}`,
        }
      }) ?? []
    )

    if (poapsList?.length) {
      options = options.concat(poapsList.filter((p) => !!p))
    }

    return options
  }, [guildsPoaps, poaps, poap, isLoading])

  return (
    <>
      <ChainInfo>Works on both ETHEREUM and GNOSIS</ChainInfo>

      <FormControl
        isRequired
        isInvalid={type && !!errors?.requirements?.[index]?.data?.id}
      >
        <FormLabel>POAP:</FormLabel>
        <InputGroup>
          {poapDetails && (
            <InputLeftElement>
              <OptionImage img={poapDetails?.image_url} alt={poapDetails?.name} />
            </InputLeftElement>
          )}
          <Controller
            name={`requirements.${index}.data.id` as const}
            control={control}
            defaultValue={field.data?.id}
            rules={{
              required: "This field is required.",
            }}
            render={({ field: { onChange, onBlur, value: selectValue, ref } }) => (
              <StyledSelect
                ref={ref}
                isClearable
                isLoading={isLoading}
                options={mappedPoaps}
                placeholder="Search..."
                value={mappedPoaps?.find((p) => p.value === selectValue)}
                defaultValue={mappedPoaps?.find((p) => p.value === field.data?.id)}
                onChange={(newValue: SelectOption) => onChange(newValue?.value)}
                onInputChange={(text, _) => {
                  const id = text?.replace("#", "")
                  if (id?.length > 2 && FANCY_ID_REGEX.test(id)) setPastedId(id)
                }}
                onBlur={onBlur}
                filterOption={customFilterOption}
              />
            )}
          />
        </InputGroup>

        <FormHelperText>Search by name or paste ID</FormHelperText>

        <FormErrorMessage>
          {errors?.requirements?.[index]?.data?.id?.message}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}

export default PoapFormCard
